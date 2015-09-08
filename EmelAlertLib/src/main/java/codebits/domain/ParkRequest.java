package main.java.codebits.domain;

import java.io.Serializable;

public class ParkRequest implements Serializable{
	
	private static final long serialVersionUID = 7306685995503515085L;
	private String userId;
	private Pair coord;
	
	public ParkRequest(String userId, Pair p) {
		super();
		this.userId = userId;
		this.coord = p;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Pair getCoord() {
		return coord;
	}

	public void setCoord(Pair p) {
		this.coord = p;
	}
	
	
	
}
