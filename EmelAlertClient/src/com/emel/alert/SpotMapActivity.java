package com.emel.alert;

import java.io.IOException;

import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;
import com.google.android.maps.Projection;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Toast;

public class SpotMapActivity extends MapActivity {
	
	private MapView map;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {

		super.onCreate(savedInstanceState);
	    setContentView(R.layout.spotmap);

	    map = (MapView)findViewById(R.id.mapview);
	    map.setBuiltInZoomControls(true);
	    map.getController().setZoom(19);
	    map.setSatellite(true);
	    map.getController().setCenter(new GeoPoint((int) (getIntent().getDoubleExtra("latitude",0) * 1E6), (int) (getIntent().getDoubleExtra("longitude",0) * 1E6)));
	    map.setOnTouchListener(new View.OnTouchListener() {
			
			@Override
			public boolean onTouch(View v, MotionEvent event) {
				Log.v("Test","TOUCHED THE MAP!");

				int x = (int)event.getX();
			    int y = (int)event.getY();
				getProj(x,y);
				return false;
			}
		});
	    
	}

	protected void getProj(int x, int y) {
		Projection projection = map.getProjection();
		GeoPoint point = projection.fromPixels(x, y);
		
		double latitude = (double)point.getLatitudeE6() / 1E6;
		double longitude = (double)point.getLongitudeE6() / 1E6;
		
		String android_id = getIntent().getStringExtra("id");
		
		String toSend = "&long=" + longitude + "&lat=" + latitude;
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
		Toast.makeText(SpotMapActivity.this, "Thank you for your participation", Toast.LENGTH_LONG).show();
		Log.v("Spotting server response: ", response);
		
		Intent intent = new Intent(SpotMapActivity.this, EmelAlertClientActivity.class);
		startActivity(intent);
	}

	@Override
	protected boolean isRouteDisplayed() {
		// TODO Auto-generated method stub
		return false;
	}

	
}
