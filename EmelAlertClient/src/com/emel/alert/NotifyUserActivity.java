package com.emel.alert;

import java.io.IOException;
import java.util.List;

import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;

import com.emel.alert.services.EmelService;
import com.emel.exceptions.EmelException;
import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.OverlayItem;

import android.app.Activity;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

public class NotifyUserActivity extends MapActivity {

	private MapView mMapView;
	private List<Overlay> mMapOverlays;
	private LocationOverlay mLocationOverlay;
	private NotificationManager mNotificationManager;
	private long idAlert;
	private Button mConfirmAlertButton;
	private Button mRefuseAlertButton;
	
	public void sendVotes(boolean vote) {

		String requestName = vote ? "/confirm" : "/refuse";	
		String serverIP = "62.28.240.126:8080/backend";
		String getURL = serverIP + requestName + "?id=" + idAlert;

		Log.v("Test",getURL);

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

		Toast.makeText(NotifyUserActivity.this, "Vote Submitted", Toast.LENGTH_LONG).show();

	}
		
	

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.notify);

		String loc = getIntent().getStringExtra("location");

		mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

		//cancel the notification
		mNotificationManager.cancel(0);

		String longitude = loc.split(";")[0];
		String latitude = loc.split(";")[1];
		idAlert = Long.parseLong(loc.split(";")[2]);

		//start google maps with location passed

		mMapView = (MapView) findViewById(R.id.mapview);
		mMapView.setBuiltInZoomControls(true);
		mMapView.getController().setCenter(new GeoPoint((int)(Double.parseDouble(latitude) * 1E6), (int)(Double.parseDouble(longitude) * 1E6)));
		mMapView.getController().setZoom(19);
		mMapView.setSatellite(true);
		mMapOverlays = mMapView.getOverlays();

		showEmelLocationAlert(latitude, longitude);

		mConfirmAlertButton = (Button)findViewById(R.id.mapVoteYesButton);
		mRefuseAlertButton = (Button)findViewById(R.id.mapVoteNoButton);

		mConfirmAlertButton.setOnClickListener(new Button.OnClickListener() {

			@Override
			public void onClick(View v) {
				sendVotes(true);
			}

		});

		mRefuseAlertButton.setOnClickListener(new Button.OnClickListener() {

			@Override
			public void onClick(View v) {
				sendVotes(false);
			}

		});

	}

	private void showEmelLocationAlert(String latitude, String longitude) {
		mLocationOverlay = new LocationOverlay(this.getResources().getDrawable(R.drawable.marker_red), this);
		GeoPoint spottingPoint = new GeoPoint((int) (Double.parseDouble(latitude) * 1E6) , (int) (Double.parseDouble(longitude) * 1E6));

		OverlayItem spottingItem = new OverlayItem(spottingPoint, getString(R.string.emel_spotted), "");
		mLocationOverlay.addOverlay(spottingItem);
		mMapOverlays.add(mLocationOverlay);

		mMapView.getController().setCenter(spottingPoint);
		//mMapView.getController().zoomToSpan();
		mMapView.invalidate();

	}

	@Override
	protected boolean isRouteDisplayed() {
		// TODO Auto-generated method stub
		return false;
	}


}
