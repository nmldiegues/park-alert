package main.java.codebits.domain;

import java.io.Serializable;

public class ParkAlert implements Serializable{
	
	private static final long serialVersionUID = 6783787432724812637L;
	private Double longi;
	private Double lat;
	
	public ParkAlert(Double longi, Double lat) {
		super();
		this.longi = longi;
		this.lat = lat;
	}
	
	public Double getLongi() {
		return longi;
	}
	public void setLongi(Double longi) {
		this.longi = longi;
	}
	public Double getLat() {
		return lat;
	}
	public void setLat(Double lat) {
		this.lat = lat;
	}
	

}
