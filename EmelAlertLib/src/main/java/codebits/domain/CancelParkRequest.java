
package main.java.codebits.domain;

import java.io.Serializable;

public class CancelParkRequest implements Serializable {
	
	private static final long serialVersionUID = 2453286153131249947L;
	private String userId;
	
	public CancelParkRequest(String userId) {
		super();
		this.userId = userId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	
	
}
