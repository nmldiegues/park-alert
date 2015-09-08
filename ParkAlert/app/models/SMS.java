package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class SMS extends Model {
	
	@ManyToOne
	private User receiver;
	@Required
	private String reportDate;
	@Required
	private String reportLocation;
	
	public SMS(User receiver, String reportDate, String reportLocation) {
		super();
		this.receiver = receiver;
		this.reportDate = reportDate;
		this.reportLocation = reportLocation;
	}
	
	public User getReceiver() {
		return receiver;
	}
	public void setDestination(User receiver) {
		this.receiver = receiver;
	}
	public String getReportDate() {
		return reportDate;
	}
	public void setReportDate(String reportDate) {
		this.reportDate = reportDate;
	}
	public String getReportLocation() {
		return reportLocation;
	}
	public void setReportLocation(String reportLocation) {
		this.reportLocation = reportLocation;
	}

}
