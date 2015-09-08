package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Notification extends Model {

	@ManyToOne
	public User receiver;
	@ManyToOne
	public User reporter;
	@Required
	public int isConfirmed;
	@Required
	public Date reportDate;
	@Required
	public double latitude;
	@Required
	public double longitude;
	@Required
	public String type;
	
	// 0: not answered; 1: confirmed; 2: denied
	public static int NOT_ACKED = 0;
	public static int CONFIRMED = 1;
	public static int DENIED = 2;
	
	public Notification(User recv, User reporter, Date date, double latitude, double longitude, String type) {
		super();
		this.receiver = recv;
		this.reporter = reporter;
		this.isConfirmed = NOT_ACKED;
		this.reportDate = date;
		this.latitude = latitude;
		this.longitude = longitude;
		this.type = type;
	}
	
	public void confirm() {
		this.isConfirmed = CONFIRMED;
		this.reporter.score += User.POINTS_FOR_CONFIRM;
		this.receiver.save();
		this.save();
	}
	
	public void deny() {
		this.isConfirmed = DENIED;
		this.reporter.score += User.POINTS_FOR_DENY;
		this.receiver.save();
		this.save();
	}
}