package com.emel.alert;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.emel.alert.services.EmelService;
import com.emel.alert.services.EmelWatchService;
import com.emel.exceptions.EmelException;


public class EmelAlertClientActivity extends Activity {
	

	
	private Button mParkButton;
	private Button mEmelSpottedButton;
	private Button mEmelSpotMapButton;
	private Button mUnparkButton;
	private Button mStatisticsButton;
	
	private Location gps;
	private LocationManager mManager;
	private String android_id;
    /** Called when the activity is first created. */
	
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        File dir = getFilesDir();
        File file = new File(dir, "myParkedCarFlag");
        boolean deleted = file.delete();

        
        final TelephonyManager tm = (TelephonyManager) getBaseContext().getSystemService(Context.TELEPHONY_SERVICE);
        android_id = "" + android.provider.Settings.Secure.getString(getContentResolver(), android.provider.Settings.Secure.ANDROID_ID);
        
        mParkButton = (Button)findViewById(R.id.parkButton);
        mEmelSpottedButton = (Button)findViewById(R.id.spotButton);
        mEmelSpotMapButton = (Button) findViewById(R.id.spotMapButton);
        mUnparkButton = (Button)findViewById(R.id.unparkButton);
        mStatisticsButton = (Button) findViewById(R.id.statisticsButton);
        
		mManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        gps = new Location(LocationManager.GPS_PROVIDER);
        mParkButton.setOnClickListener(new Button.OnClickListener() {

			@Override
			public void onClick(View v) {
				//Toast.makeText(EmelAlertClientActivity.this, "hello", Toast.LENGTH_LONG).show();
				
				ConnectivityManager connectivityManager = (ConnectivityManager) EmelAlertClientActivity.this.getSystemService(Context.CONNECTIVITY_SERVICE);
			    NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
			    
			    if(activeNetworkInfo == null){
			    	Toast.makeText(EmelAlertClientActivity.this, "No network connection", Toast.LENGTH_LONG).show();
			    	return;
			    }
				
				LocationListener mListener = new LocationListener() {
					@Override
					public void onStatusChanged(String provider, int status, Bundle extras) {}
					@Override
					public void onProviderEnabled(String provider) {}
					@Override
					public void onProviderDisabled(String provider) {}
					@Override
					public void onLocationChanged(Location location) {
						gps = location;
					}
				};
				
				gps.setLatitude(0);
				gps.setLongitude(0);
				mManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, mListener);
				//String toSend = gps.getLatitude() + "&" + gps.getLongitude();

				
				Intent intent = new Intent(EmelAlertClientActivity.this, EmelService.class);
				intent.putExtra("latitude", "38.769078"); //switch to gps.getLongitude
				intent.putExtra("longitude", "-9.092563");
				intent.putExtra("id", android_id);
				

				//Toast.makeText(EmelAlertClientActivity.this, "started service", Toast.LENGTH_LONG).show();
				
				startService(intent);
			
			}

			
        });
        
        mEmelSpottedButton.setOnClickListener(new Button.OnClickListener() {

			@Override
			public void onClick(View v) {
				ConnectivityManager connectivityManager = (ConnectivityManager) EmelAlertClientActivity.this.getSystemService(Context.CONNECTIVITY_SERVICE);
			    NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
			    
			    if(activeNetworkInfo == null){
			    	Toast.makeText(EmelAlertClientActivity.this, "No network connection", Toast.LENGTH_LONG).show();
			    	return;
			    }
			    
			    LocationListener mListener = new LocationListener() {
					@Override
					public void onStatusChanged(String provider, int status, Bundle extras) {}
					@Override
					public void onProviderEnabled(String provider) {}
					@Override
					public void onProviderDisabled(String provider) {}
					@Override
					public void onLocationChanged(Location location) {
						gps = location;
					}	
				};
				
				gps.setLatitude(0);
				gps.setLongitude(0);
				mManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, mListener);
				String toSend = "&long=" + -9.092563 + "&lat=" + 38.769078;
				String requestName = "/report?";
				String serverIP = "62.28.240.126:8080/backend";
				String getURL = serverIP + requestName + "id="+ android_id + toSend;//URLEncoder.encode(new String(encoded));
				
				
				HttpGet request = new HttpGet("http://" + getURL);
				HttpClient client = new DefaultHttpClient();

				ResponseHandler<String> handler = new BasicResponseHandler();
				String response = "";
				
				Log.v("Test","Waiting for server answer...");
				try {
					response = 	client.execute(request, handler);
				} catch (IOException e) {
					e.printStackTrace();
				}
				Toast.makeText(EmelAlertClientActivity.this, "Thank you for your participation", Toast.LENGTH_LONG).show();
				Log.v("Spotting server response: ", response);
			}
			
        });
    
        mUnparkButton.setOnClickListener(new Button.OnClickListener(){

			@Override
			public void onClick(View v) {
				String requestName = "/cancel?";
				String serverIP = "62.28.240.126:8080/backend";
				String getURL = serverIP + requestName + "id="+ android_id;
				
				
				HttpGet request = new HttpGet("http://" + getURL);
				HttpClient client = new DefaultHttpClient();

				ResponseHandler<String> handler = new BasicResponseHandler();
				String response = "";
				
				Log.v("Test","Waiting for server answer...");
				try {
					response = 	client.execute(request, handler);
				} catch (IOException e) {
					e.printStackTrace();
				}
				
				EmelWatchService.thread.interrupt();
				
				Toast.makeText(EmelAlertClientActivity.this, "Car unparked", Toast.LENGTH_LONG).show();
				File dir = getFilesDir();
		        File file = new File(dir, "myParkedCarFlag");
		        file.delete();
				Log.v("Unpark server response: ", response);
				
			}
        	
        });
        
        mEmelSpotMapButton.setOnClickListener(new Button.OnClickListener(){

			@Override
			public void onClick(View v) {
				gps.setLatitude(0);
				gps.setLongitude(0);
				LocationListener mListener = new LocationListener() {
					@Override
					public void onStatusChanged(String provider, int status, Bundle extras) {}
					@Override
					public void onProviderEnabled(String provider) {}
					@Override
					public void onProviderDisabled(String provider) {}
					@Override
					public void onLocationChanged(Location location) {
						gps = location;
					}	
				};
				mManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, mListener);
				//start mapview activity
				Intent intent = new Intent(EmelAlertClientActivity.this, SpotMapActivity.class);
				intent.putExtra("id", android_id);
				intent.putExtra("latitude", 38.769078);//mudat para gps.getLatitude()
				intent.putExtra("longitude", -9.092563);
				
				startActivity(intent);
				
			}
        	
        });
        
        
        mStatisticsButton.setOnClickListener(new Button.OnClickListener(){

        	@Override
			public void onClick(View v) {
				String requestName = "/userRank";
				String serverIP = "62.28.240.126:8080/backend";
				String getURL = serverIP + requestName;
				
				
				HttpGet request = new HttpGet("http://" + getURL);
				HttpClient client = new DefaultHttpClient();

				ResponseHandler<String> handler = new BasicResponseHandler();
				String response = "";
				
				Log.v("Test","Waiting for server answer...");
				try {
					response = 	client.execute(request, handler);
				} catch (IOException e) {
					e.printStackTrace();
				}
				Toast.makeText(EmelAlertClientActivity.this, "Statistics received", Toast.LENGTH_LONG).show();
				//show statistics to user
				
				Log.v("Statistics server response: ", response);
				
				Intent intent = new Intent(EmelAlertClientActivity.this, StatisticsActivity.class);
				intent.putExtra("stats", response);
				
				startActivity(intent);				
				
			}
        	
        });
        
    }
}