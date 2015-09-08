package models;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Report extends Model {

	@Required
	public Double latitude;
	@Required
	public Double longitude;
	@Required
	public Long date;
	@Required
	public String type;
	@ManyToOne
	public User user;
	@Required
	public boolean affectedSomeUser = false;
	
	public transient float fade = 100.0f;
	
	public Report(Double latitude, Double longitude, Long date, String type, User user) {
		super();
		this.latitude = latitude;
		this.longitude = longitude;
		this.date = date;
		this.type = type;
		this.user = user;
	}	
	
	public String getDateString() {
		return new Date(date).toLocaleString();
	}
	
	public static List<Report> getCloseReports(double latitude, double longitude) {
		long now = System.currentTimeMillis();
		List<Report> reports = Report.find("select r from Report r where r.date > ?", now - User.MAX_TIME_RECENT_REPORTS).fetch();
		List<Report> result = new ArrayList<Report>();
		for (Report report : reports) {
			if (User.distanceBetweenCoords(latitude, longitude, report.latitude, report.longitude) <= User.MAX_DISTANCE_FOR_WARNING) {
				result.add(report);
				long timePassed = now - report.date;
				report.fade = (100.0f - ((timePassed * 100.0f) / User.MAX_TIME_RECENT_REPORTS)) / 100.0f;
			}
		}
		
		return result;
	}
}
