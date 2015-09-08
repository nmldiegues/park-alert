package main.java.codebits.domain;

import java.io.Serializable;

public class Pair implements Serializable{

	private static final long serialVersionUID = -6308254803263129197L;
	private Double longt;
	private Double lat;
	
	public Pair(Double longt, Double lat) {
		super();
		this.longt = longt;
		this.lat = lat;
	}

	public Double getLongt() {
		return longt;
	}

	public void setLongt(Double longt) {
		this.longt = longt;
	}

	public Double getLat() {
		return lat;
	}

	public void setLat(Double lat) {
		this.lat = lat;
	}
	
	
	
}
