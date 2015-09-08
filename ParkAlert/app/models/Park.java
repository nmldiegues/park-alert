package models;


import java.text.DecimalFormat;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import org.apache.commons.lang.time.DurationFormatUtils;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Park extends Model {

	@Required
	public Double latitude;
	@Required
	public Double longitude;
	@Required
	public Date date;
	@ManyToOne
	public User user;
	@Required
	public volatile boolean removed;
	@Required
	public long timeParked = 0L;
	
	public Park(Double latitude, Double longitude, Date date, User user) {
		super();
		this.latitude = latitude;
		this.longitude = longitude;
		this.date = date;
		this.user = user;
		this.removed = false;
	}
	
	public void removeCar() {
		this.removed = true;
		this.timeParked = new Date().getTime() - date.getTime();
	}
	
	public String getParkedTime() {
		return DurationFormatUtils.formatDuration(timeParked, "HH:mm");
	}
	
	public double getCost() {
		// Taking into account the place where each park was performed, one 
		// could come up with a more precise amount of money by mapping the 
		// cost of each zone to GPS locations
		final double pricePerMinute = 0.02 / 60 / 1000;	// estimate 1.20euro per hour
		DecimalFormat twoDForm = new DecimalFormat("#.##");
		return Double.valueOf(twoDForm.format(timeParked * pricePerMinute));
	}
}
