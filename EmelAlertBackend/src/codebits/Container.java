package codebits;

import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServlet;

public class Container {

	public static final int PREMIUM_DISTANCE_TO_WARN = 50;
	public static final int MINIMUM_DISTANCE_TO_WARN = 100;
	public static ConcurrentHashMap<String, UserParked> userCoord = new ConcurrentHashMap<String, UserParked>();
	public static ConcurrentHashMap<Long, String> userReports = new ConcurrentHashMap<Long, String>();
	public static Long idReport = 0L;
	public static ConcurrentHashMap<String, Integer> userRank = new ConcurrentHashMap<String, Integer>();

	public synchronized static Long newReportID() {
		return idReport++;
	}

	public static double distanceBetweenCoords(double lat1, double lng1, double lat2, double lng2) {

		double earthRadius = 6367;
		double dLat = Math.toRadians(lat2-lat1);
		double dLng = Math.toRadians(lng2-lng1);
		double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(Math.toRadians(lat1)) *
				Math.cos(Math.toRadians(lat2)) *
				Math.sin(dLng/2) * Math.sin(dLng/2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		double dist = earthRadius * c;

		return dist * 1000;
	}

	public static void warnUser(Double longt, Double lat, String reporter, Long reportID) {
		userReports.put(reportID, reporter);
		for(UserParked userParked : userCoord.values()) {
			Debug.log(ReportServlet.SERVLET, "[ReportServlet]: checking user " + userParked.getId() + " ip: " + userParked.getClientAddress() + " long: " + userParked.getLongitude() + " lat: " + userParked.getLatitude());
			double distance = distanceBetweenCoords(lat, longt, userParked.getLatitude(), userParked.getLongitude());
			Debug.log(ReportServlet.SERVLET, "[ReportServlet]: distance: " + distance);

			if(userParked.isPremium() && distance < PREMIUM_DISTANCE_TO_WARN) {
				Debug.log(ReportServlet.SERVLET, "[ReportServlet]: user premium is close enough!");
				NotifyUsers.notifyUser(userParked.getClientAddress(), longt, lat, reportID);
			} else if(!userParked.isPremium() && distance < MINIMUM_DISTANCE_TO_WARN) {
				Debug.log(ReportServlet.SERVLET, "[ReportServlet]: user normal is close enough!");
				NotifyUsers.notifyUser(userParked.getClientAddress(), longt, lat, reportID);	
			}
		}
	}
}
