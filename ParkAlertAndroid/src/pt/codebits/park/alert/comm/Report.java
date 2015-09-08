package pt.codebits.park.alert.comm;

public class Report {
	
	public long id;
	public double latitude;
	public double longitude;
	public long date;
	public float fade;
	
	public Report(long id, double latitude, double longitude, long date, float fade) {
		this.id = id;
		this.latitude = latitude;
		this.longitude = longitude;
		this.date = date;
		this.fade = fade;
	}
}
