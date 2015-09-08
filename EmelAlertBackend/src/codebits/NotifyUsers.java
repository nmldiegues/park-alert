package codebits;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class NotifyUsers implements Runnable {

	public static final int CLIENT_PORT = 22222;
	public static final int NUMBER_THREADS = 8;
	public static final Executor threadPool = Executors.newFixedThreadPool(NUMBER_THREADS);
	
	public static void notifyUser(String clientAddress, double longitude, double latitude, Long reportID) {
		NotifyUsers.threadPool.execute(new NotifyUsers(clientAddress, longitude, latitude, reportID));
	}
	
	private String clientAddress;
	private double longitude;
	private double latitude;
	private Long reportID;
	
	public NotifyUsers(String clientAddress, double longitude, double latitude, Long reportID) {
		this.clientAddress = clientAddress;
		this.longitude = longitude;
		this.latitude = latitude;
		this.reportID = reportID;
	}
	
	@Override
	public void run() {
		Socket clientSocket = null;
		PrintWriter out = null;
		try {
			Debug.log(ReportServlet.SERVLET, "[NotifyUsers]: notifying user: " + clientAddress);
			clientSocket = new Socket(InetAddress.getByName(clientAddress), CLIENT_PORT);
			out = new PrintWriter(clientSocket.getOutputStream(), true);
			out.write(longitude + ";" + latitude + ";" + reportID);
			Debug.log(ReportServlet.SERVLET, "[NotifyUsers]: end notify user: " + clientAddress);
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (out != null) {
				out.close();
			}
			if (clientSocket != null) {
				try {
					clientSocket.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
}
