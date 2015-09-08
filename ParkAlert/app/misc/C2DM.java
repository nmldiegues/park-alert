package misc;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Date;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSession;

import models.Notification;
import models.Report;
import models.User;


public class C2DM {

	public String token;
	
	public boolean wasLastStatusOK = true;

	private String obtainToken() throws IOException {
		// Create the post data
		// Requires a field with the email and the password
		StringBuilder builder = new StringBuilder();
		builder.append("Email=").append("park.alert.codebits@gmail.com");
		builder.append("&Passwd=").append("parkalertappcodebits");
		builder.append("&accountType=GOOGLE");
		builder.append("&source=MyLittleExample");
		builder.append("&service=ac2dm");

		// Setup the Http Post
		byte[] data = builder.toString().getBytes();
		URL url = new URL("https://www.google.com/accounts/ClientLogin");
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setUseCaches(false);
		con.setDoOutput(true);
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		con.setRequestProperty("Content-Length", Integer.toString(data.length));

		// Issue the HTTP POST request
		OutputStream output = con.getOutputStream();
		output.write(data);
		output.close();

		// Read the response
		BufferedReader reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String line = null;
		String auth_key = null;
		while ((line = reader.readLine()) != null) {
			if (line.startsWith("Auth=")) {
				auth_key = line.substring(5);
			}
		}

		// Finally get the authentication token
		// To something useful with it
		return auth_key;
	}

	private final static String AUTH = "authentication";

	private static final String UPDATE_CLIENT_AUTH = "Update-Client-Auth";

	public static final String PARAM_REGISTRATION_ID = "registration_id";

	public static final String PARAM_DELAY_WHILE_IDLE = "delay_while_idle";

	public static final String PARAM_COLLAPSE_KEY = "collapse_key";

	private static final String UTF8 = "UTF-8";

	private static final Integer DEFAULT_BACKOFF = 30000;

	public void sendMessage(Report report, User dest, String message) {
		
		Notification notif = new Notification(dest, report.user, new Date(), report.latitude, report.longitude, "c2dm");
		notif.save();
		dest.notifications.add(notif);
		dest.save();
		
		message += ":"+notif.id+":"+notif.latitude+":"+notif.longitude;
		
		final Logger LOGGER = Logger.getLogger("MessageLog");
		LOGGER.setLevel(Level.INFO);
		LOGGER.info("Sent notif number "+notif.id);

		try {
			StringBuilder postDataBuilder = new StringBuilder();
			postDataBuilder.append(PARAM_REGISTRATION_ID).append("=").append(dest.c2dmID);
			postDataBuilder.append("&").append(PARAM_COLLAPSE_KEY).append("=").append("0");
			postDataBuilder.append("&").append("data.payload").append("=").append(URLEncoder.encode(message, UTF8));

			byte[] postData = postDataBuilder.toString().getBytes(UTF8);

			// Hit the dm URL.

			URL url = new URL("https://android.clients.google.com/c2dm/send");
			HttpsURLConnection.setDefaultHostnameVerifier(new CustomizedHostnameVerifier());
			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setUseCaches(false);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
			conn.setRequestProperty("Content-Length", Integer.toString(postData.length));
			conn.setRequestProperty("Authorization", "GoogleLogin auth=" + token);

			OutputStream out = conn.getOutputStream();
			out.write(postData);
			out.close();

			int responseCode = conn.getResponseCode();

			handleResponseCode(report, dest,responseCode,conn);

			
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void handleResponseCode(Report report, User user, int responseCode, HttpsURLConnection conn) throws IOException {
		switch(responseCode) {
		case 200: {
			wasLastStatusOK = true;
			System.out.println(responseCode);
			BufferedReader b = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String s = b.readLine();
			System.out.println(s);
			String error = s;
			if(s!=null) {
				error = s.replace("Error=", "");
			}
			// TODO: meter o comportamento 
			if(error.equals("QuotaExceeded")) {
				System.out.println("QuotaExceeded");
			} else if(error.equals("DeviceQuotaExceeded")) {
				System.out.println("DeviceQuotaExceeded");
			} else if(error.equals("InvalidRegistration")) {
				System.out.println("InvalidRegistration");
			} else if(error.equals("NotRegistered")) {
				System.out.println("NotRegistered");
			} else if(error.equals("MessageTooBig")) {
				System.out.println("MessageTooBig");
			} else if(error.equals("MissingCollapseKey")) {
				System.out.println("MissingCollapseKey");
			}
			break;
		}

		case 401: {
			
			if(!wasLastStatusOK) {
				SMSUtils.sendSMS(user,report);
				final Logger LOGGER = Logger.getLogger("MessageLog");
				LOGGER.setLevel(Level.INFO);
				LOGGER.info("Sending to: "+"+351"+user.cellphone);
				return;
			}
			
			try {
				System.out.println("401");
				token = obtainToken();
				wasLastStatusOK = false;
				sendMessage(report, user, "Reportado um funcionário perto do seu carro!");
			} catch (IOException e) {
				e.printStackTrace();
			}
			break;
		}

		case 503: {
			System.out.println(responseCode);
			Integer backoff = Integer.parseInt(conn.getHeaderField("Retry-After"));
			backoff(backoff);
		}
		default : {
			System.out.println("Default?!");
		}
		}
	}

	private static void backoff(Integer backoff) {
		if(backoff==null)
			backoff = DEFAULT_BACKOFF;
		try {
			Thread.sleep(backoff);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		backoff*=2;
	}

	private static class CustomizedHostnameVerifier implements HostnameVerifier {
		public boolean verify(String hostname, SSLSession session) {
			return true;
		}
	}

}
