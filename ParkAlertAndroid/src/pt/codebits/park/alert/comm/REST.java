package pt.codebits.park.alert.comm;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import pt.codebits.park.alert.LoginActivity;
import pt.codebits.park.alert.OfflineActivity;
import pt.codebits.park.alert.R;
import pt.codebits.park.alert.RegisterActivity;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

public class REST {
	static final String MOBILE = "mobile";

	public static String getCentralServerAddr(Context context) {
		return "http://" + context.getString(R.string.centralserverip) + "/";
	}

	public static String getReport(Context context, long tokenId, String tokenValue, long reportId) {
		return makeGetWithValidation(context, getCentralServerAddr(context) + "getReport/" + tokenId + "/" + tokenValue + "/" + reportId);
	}
	
	public static String fetchReports(Context context, long tokenId, String tokenValue) {
		return makeGetWithValidation(context, getCentralServerAddr(context) + "fetchReports/" + tokenId + "/" + tokenValue);
	}
	
	public static String fetchParkState(Context context, long tokenId, String tokenValue) {
		return makeGetWithValidation(context, getCentralServerAddr(context) + "fetchParkState/" + tokenId + "/" + tokenValue);
	}
	
	public static String confirmNotification(Context context, String nid) {
		return makeGetWithValidation(context, getCentralServerAddr(context) +"confirmNotif"+"/"+nid);
	}
	
	public static String denyNotification(Context context, String nid) {
		return makeGetWithValidation(context, getCentralServerAddr(context) +"denyNotif"+"/"+nid);
	}
	
	public static String registerUser(Context context, String username, String password, String email, String phone) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("username", username);
		params.put("password", password);
		params.put("email", email);
		params.put("type", MOBILE);
		params.put("cellphone", phone);
		return makePostWithValidation(context, getCentralServerAddr(context) + "newuser", params);
	}
	
	public static String loginUser(Context context, String username, String password) {
		return makeGetWithValidation(context, getCentralServerAddr(context)+"login"+"/"+username+"/"+password);
	}

	public static String loginFacebook(Context context, String socialId, String name, String email) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("socialId", socialId);
		params.put("name", name);
		params.put("email", email);
		params.put("type", MOBILE);
		return makePostWithValidation(context, getCentralServerAddr(context) + "androidFbLogin", params);
	}
	
	public static String loginTwitter(Context context, String screenName, String name){
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("screenName", screenName);
		params.put("name", name);
		params.put("type", MOBILE);
		return makePostWithValidation(context, getCentralServerAddr(context) + "androidTwitLogin", params);
	}
	
	public static String parkRequest(Context context, long tokenId, String tokenValue, double latitude, double longitude) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("tokenId", tokenId);
		params.put("tokenValue", tokenValue);
		params.put("latitude", latitude);
		params.put("longitude", longitude);
		params.put("type", MOBILE);
		return makePostWithValidation(context, getCentralServerAddr(context) + "parkRemote", params);
	}
	
	public static String agentSpottingRequest(Context context, long tokenId, String tokenValue, double latitude, double longitude){
		return makeGet(getCentralServerAddr(context) + "newReport/" + tokenId + "/" + tokenValue + "/" + MOBILE + "/" + latitude + "/" + longitude);
	}
	
	public static String closeReports(Context context, long tokenId, String tokenValue, double latitude, double longitude){
		return makeGet(getCentralServerAddr(context) + "closeReports/" + tokenId + "/" + tokenValue + "/" + latitude + "/" + longitude);
	}
	
	public static String unparkRequest(Context context, long tokenId, String tokenValue) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("tokenId", tokenId);
		params.put("tokenValue", tokenValue);
		params.put("type", MOBILE);
		return makePostWithValidation(context, getCentralServerAddr(context) + "removeParkRemote", params);
	}
	
	public static String rankingRequest(Context context, long tokenId, String tokenValue, int amount){
		return makeGet(getCentralServerAddr(context) + "getRanks/" + tokenId + "/" + tokenValue + "/" + amount);
	}
	
	public static String registDevice(Context context, long tokenId, String tokenValue, String registrationID) {
		return makeGetWithValidation(context, getCentralServerAddr(context) + "registAndroid/"+tokenId+"/"+tokenValue+"/"+registrationID);
	}
	
	public static String revalidateToken(Context context, long tokenId, String tokenValue) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("tokenId", tokenId);
		params.put("tokenValue", tokenValue);
		return makePostWithValidation(context, getCentralServerAddr(context) + "revalidateToken", params);
	}
	
	// Returns true if the token was revalidated and the request must be repeated
	private static boolean checkForTokenRevalidation(Context context, String response) {
		if (response == null) {
			return false;
		}
		if (!response.startsWith("repeat")) {
			return false;
		}
		
		long tokenId = Authentication.getTokenIdRevalidated(response);
		String tokenValue = Authentication.getTokenValueRevalidated(response);
		
		SharedPreferences.Editor editor = context.getSharedPreferences(RegisterActivity.PREFS_NAME, context.MODE_PRIVATE).edit();
		editor.putString("regular_access_token", tokenId + ":" + tokenValue);
        editor.commit();
		
		return true;
	}
	
	private static final String NO_CONNECTION = "NO_CONNECTION";
	
	// Returns true if some condition was found such that the application cannot continue
	public static boolean checkForStopConditions(Context context, String response) {
		if (checkForInternetFailure(context, response) ||
				checkForFailedLogin(context, response)) {
			return true;
		}
		return false;
	}
	
	// Returns true if there is an internet failure and the application is being redirected
	private static boolean checkForInternetFailure(Context context, String response) {
		if (response.equals(NO_CONNECTION)) {
			Log.i("[REST]", "launching offline activity");
			OfflineActivity.launchOfflineActivity(context);
			return true;
		}
		return false;
	}
	
	private static final String LOGIN_FAIL = "wrongLogIn";
	
	// Returns true if the user has not been successfully logged in and the application is being redirected
	private static boolean checkForFailedLogin(Context context, String response) {
		if (response.equals(LOGIN_FAIL)) {
			Log.i("[REST]", "Login failed, redirecting to login");
			LoginActivity.redirectToLogin((Activity)context);
			return true;
		}
		return false;
	}
	
	private static String makeGetWithValidation(Context context, String path) {
		String response = makeGet(path);
		if (checkForTokenRevalidation(context, response)) {
			response = makeGet(path);
		}
		return response;
	}
	
	private static String makePostWithValidation(Context context, String path, Map<String, Object> params) {
		String response = makePost(path, params);
		if (checkForTokenRevalidation(context, response)) {
			response = makePost(path, params);
		}
		return response;
	}
	
	private static String makeGet(String path) {
		HttpClient httpclient = new DefaultHttpClient();
		HttpResponse response;
		try {
			response = httpclient.execute(new HttpGet(path));
			StatusLine statusLine = response.getStatusLine();
			System.out.println("GOT : "+statusLine.getStatusCode());
			if(statusLine.getStatusCode() == HttpStatus.SC_OK){
				ByteArrayOutputStream out = new ByteArrayOutputStream();
				response.getEntity().writeTo(out);
				out.close();
				String responseString = out.toString();
				return responseString;
			} else{
				//Closes the connection.
				response.getEntity().getContent().close();
				throw new IOException(statusLine.getReasonPhrase());
			}
		} catch (ClientProtocolException e) {
			Log.e("[REST]", "makeGet: " + path, e);
			return NO_CONNECTION;
		} catch (IOException e) {
			Log.e("[REST]", "makeGet: " + path, e);
			return NO_CONNECTION;
		}
		
	}

	private static String makePost(String path, Map<String, Object> params){

		DefaultHttpClient httpclient = new DefaultHttpClient();
		HttpPost httppost = new HttpPost(path);
		Iterator<Map.Entry<String, Object>> iter = params.entrySet().iterator();

		JSONObject holder = new JSONObject();

		try {
			while(iter.hasNext()) {
				Map.Entry<String, Object> pairs = iter.next();
				String key = pairs.getKey();
				Object value = pairs.getValue();
				holder.put(key, value);
			}
			
			StringEntity se = new StringEntity(holder.toString());
			httppost.setEntity(se);
			httppost.setHeader("Accept", "application/json");
			httppost.setHeader("Content-type", "application/json");

			HttpResponse response = httpclient.execute(httppost);

			return EntityUtils.toString(response.getEntity());

		} catch (JSONException e) {
			Log.e("[REST]", "makePost: " + path, e);
			return NO_CONNECTION;
		} catch (UnsupportedEncodingException e) {
			Log.e("[REST]", "makePost: " + path, e);
			return NO_CONNECTION;
		} catch (ClientProtocolException e) {
			Log.e("[REST]", "makePost: " + path, e);
			return NO_CONNECTION;
		} catch (IOException e) {
			Log.e("[REST]", "makePost: " + path, e);
			return NO_CONNECTION;
		}

	}

}
