package main.java.codebits.domain;

import java.io.Serializable;

public class ReportRequest implements Serializable{
	
	private static final long serialVersionUID = 4921657574119142609L;
	private Pair coord;

	public ReportRequest(Pair coord) {
		super();
		this.coord = coord;
	}

	public Pair getCoord() {
		return coord;
	}

	public void setCoord(Pair coord) {
		this.coord = coord;
	}
	
	
}
