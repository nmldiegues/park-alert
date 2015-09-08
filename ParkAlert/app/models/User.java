package models;


import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import controllers.PrivateWeb;

import misc.C2DM;
import misc.ValidationError;
import play.data.validation.Required;
import play.data.validation.Validation;
import play.data.validation.Validation.ValidationResult;
import play.db.jpa.Model;
import play.libs.Crypto;

@Entity
public class User extends Model {

	@Required
	public String username;

	public String socialId;

	@Required
	public String password;	// password = hash ( inputPassword + salt )

	@Required
	public String salt;

	@Required
	public String email;

	public String cellphone;

	public byte[] avatar;

	@Required
	public Long score;

	public String c2dmID;

	@OneToMany(mappedBy="user")
	public List<Report> reports;
	
	@OneToMany(mappedBy="receiver")
	public List<Notification> notifications;
	
	@OneToMany(mappedBy="reporter")
	public List<Notification> notificationsCausedByMe;
	
	@OneToMany(mappedBy="user", cascade=CascadeType.ALL)
	public List<Park> parks;

	@ManyToMany(mappedBy="users")
	public List<Badge> badges;

	@ManyToMany
	public List<Report> reportsAffectingMe;
	
	@Required
	public Date registrationDate;
	
	public static final long POINTS_FOR_PARK = -1L;
	public static final long POINTS_FOR_REPORT = 2L;
	public static final long POINTS_FOR_CONFIRM = 4L;
	public static final long POINTS_FOR_DENY = -4L;

	protected static final SecureRandom random = new SecureRandom();	// it is thread-safe

	public static String hashPassword(String inputPassword, String salt) {
		return Crypto.passwordHash(inputPassword + salt);
	}

	public User(String username, String password, String email,
			String cellphone, byte[] avatar) {
		this.username = username;
		this.salt = new BigInteger(64, random).toString(32);
		this.password = hashPassword(password, this.salt);
		this.email = email;
		this.cellphone = cellphone;
		this.reports = new ArrayList<Report>();
		this.parks = new ArrayList<Park>();
		this.badges = new ArrayList<Badge>();
		this.reportsAffectingMe = new ArrayList<Report>();
		this.avatar = avatar;
		this.score = 20L;
		this.registrationDate = new Date();
		this.notifications = new ArrayList<Notification>();
		this.notificationsCausedByMe = new ArrayList<Notification>();
	}

	public Long getScore() {
		return score;
	}
	
	public static boolean connect(String username, String passwordAttempted) {
		User u = User.find("byUsername",username).first();
		if (u == null) {
			return false;
		}
		return u.authenticate(passwordAttempted);
	}

	protected boolean authenticate(String passAttempted) {
		return hashPassword(passAttempted, this.salt).equals(this.password);
	}

	public Token generateToken() {
		return new Token(this).save();
	}

	public void parkCar(double latitude, double longitude) {
		Park park = new Park(latitude, longitude, new Date(), this).save();
		this.parks.add(park);
		this.score += POINTS_FOR_PARK;
		this.save();
	}

	public void unpark() {
		if (this.parks.size() == 0) {
			return;
		}

		Park park = this.parks.get(this.parks.size() - 1);
		park.removeCar();
		park.save(); 
		this.save();
	}

	public void report(double latitude, double longitude, String type) {
		Report r = new Report(latitude, longitude, System.currentTimeMillis(), type, this);
		r.save();
		this.reports.add(r);

		List<User> users = User.findAll();
		
		boolean helpedUsers = false;
		for (User user : users) {
			if (user.newReportDetected(r)) {
				helpedUsers = true;
			}
		}

		if (helpedUsers) {
			this.score += POINTS_FOR_REPORT;
		}
		this.save();
	}

	// returns a potential error
	public static ValidationError createNormalUser(Validation validation, String username, String password, String email, String cellphone) {
		if (username == null || username.length() == 0) {
			return ValidationError.USERNAME_EMPTY;
		}
		
		if (password == null || password.length() == 0) {
			return ValidationError.PASSWORD_EMPTY;
		}
		
		ValidationResult emailValidation = validation.email(email);
		if (!emailValidation.ok) {
			return ValidationError.EMAIL_INCORRECT;
		}
		
		if(cellphone != null && cellphone.length() != 0) {
			ValidationResult phoneValidation = validation.phone(cellphone);
			if (!phoneValidation.ok) {
				return ValidationError.PHONE_NUMBER_INCORRECT;
			}
		}
		
		User newUser = User.find("byUsername",username).first();
		if (newUser != null) {
			return ValidationError.USERNAME_ALREADY_EXISTS;
		}
		
		newUser = new User(username, password, email, cellphone, null);
		newUser.save();
		
		return null;
	}
	
	public static User findOrCreateSocialUser(String socialId, String name, String email) {
		User user = User.find("bySocialId", socialId).first();
		if (user == null) {
			// TODO get the user cellphone
			user = new User(name, "", email, null, null);
			user.socialId = socialId;
			user.save();
		}
		return user;
	}
	
	public static User findOrCreateSocialUser(String socialId, String name) {
		User user = User.find("bySocialId", socialId).first();
		if (user == null) {
			// TODO get the user cellphone
			user = new User(name, "", null, null, null);
			user.socialId = socialId;
			user.save();
		}
		return user;
	}

	protected static final double MAX_DISTANCE_FOR_WARNING = 750;

	protected static final long MAX_TIME_RECENT_REPORTS = 1000 * 60 * 60;
	// subtract 1 hour from the time of the request
	public List<Report> fetchNewReportsSince(long requestDate, boolean subtract) {
		long deadline = requestDate - (subtract ? MAX_TIME_RECENT_REPORTS : 0);
		List<Report> newReports = new ArrayList<Report>();
		
		int parksSize = this.parks.size();
		Park park = (parksSize > 0 ? this.parks.get(parksSize - 1) : null);
		if (park == null || park.removed) {
			return newReports;
		}
		
		int sizeReports = reportsAffectingMe.size();
		// Traverse backwards because the reports are laid out in the list in increasing time order
		for (int i = sizeReports - 1; i >= 0; i--) {
			Report affectingMe = reportsAffectingMe.get(i);
			if (affectingMe.date >= deadline && distanceBetweenCoords(park.latitude, park.longitude, affectingMe.latitude, affectingMe.longitude) <= MAX_DISTANCE_FOR_WARNING) {
				newReports.add(affectingMe);
				long timePassed = requestDate - affectingMe.date;
				affectingMe.fade = (100.0f - ((timePassed * 100.0f) / MAX_TIME_RECENT_REPORTS)) / 100.0f;
			} else {
				break;
			}
		}
		return newReports;
	}

	public boolean newReportDetected(Report report) {
		int parksSize = this.parks.size();
		if (parksSize == 0) {
			return false;
		}
		Park park = this.parks.get(parksSize - 1);
		if (park.removed) {
			return false;
		}

		if (distanceBetweenCoords(park.latitude, park.longitude, report.latitude, report.longitude) > MAX_DISTANCE_FOR_WARNING) {
			return false;
		}

		this.reportsAffectingMe.add(report);
		this.save();
		report.affectedSomeUser = true;
		report.save();
		
		// TODO spawn a thread or use a thread pool to execute batch jobs (most likely play 
		// offers some utility for this?) to process the report and make the notifications
		if(this.c2dmID!=null) {
			new C2DM().sendMessage(report, this, "Reportado um funcionário perto do seu carro");
		}

		return true;
	}

	protected static double distanceBetweenCoords(double lat1, double lng1, double lat2, double lng2) {
		double earthRadius = 6367;
		double dLat = Math.toRadians(lat2-lat1);
		double dLng = Math.toRadians(lng2-lng1);
		double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(Math.toRadians(lat1)) *
		Math.cos(Math.toRadians(lat2)) *
		Math.sin(dLng/2) * Math.sin(dLng/2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		double dist = earthRadius * c;

		return dist * 1000;
	}

}
