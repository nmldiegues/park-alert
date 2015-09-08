package codebits;

public class UserParked {
	
	private double longitude;
	private double latitude;
	private boolean premium;
	private String id;
	private volatile String clientAddress;
	
	public UserParked(double longitude, double latitude, boolean premium,
			String id, String clientAddress) {
		super();
		this.longitude = longitude;
		this.latitude = latitude;
		this.premium = premium;
		this.id = id;
		this.clientAddress = clientAddress;
	}
		
	public boolean isPremium() {
		return premium;
	}

	public void setPremium(boolean premium) {
		this.premium = premium;
	}

	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getClientAddress() {
		return clientAddress;
	}
	public void setClientAddress(String clientAddress) {
		this.clientAddress = clientAddress;
	}

}
