package com.emel.alert.services;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import com.emel.alert.EmelAlertClientActivity;
import com.emel.exceptions.EmelException;

public class EmelService extends Service {
	
	private Intent intent;
	private Context context;
	
	/*public class waitConnection extends AsyncTask<Intent, Void,Void> {

		@Override
		protected Void doInBackground(Intent... arg0) {
			Looper.prepare();
			try {
				sendParkRequest(intent);
			} catch (EmelException e) {
				Toast.makeText(EmelService.this, e.getException() , Toast.LENGTH_LONG).show();
				e.printStackTrace();
				return null;
			}
			return null;
		}
		
	}*/

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Log.v("TEST2","entered service");

		this.intent = intent;
		
		//new waitConnection().execute();
		try {
			sendParkRequest(intent);
		} catch (EmelException e) {
			Toast.makeText(EmelService.this, e.getException() , Toast.LENGTH_LONG).show();
			e.printStackTrace();
			
		}
		return 0;
	}
	
	private void storeFlag(String filename) throws EmelException{
		String str = "1";
		FileOutputStream out;
		try {
			out = openFileOutput(filename, Context.MODE_PRIVATE);
			out.write(str.getBytes());
			out.close();
		} catch (FileNotFoundException e) {
			throw new EmelException("error: File not found");
		} catch (IOException e) {
			throw new EmelException("error: IO exception");
		}
	}

	private void sendParkRequest(Intent intent) throws EmelException{
		String input;
		String latitude = null;
		String longitude = null;
		String id = intent.getStringExtra("id");
		String requestName;
		String serverIP = "62.28.240.126:8080/backend";
		String getURL;
		boolean flagFile = true;

		FileInputStream in;

		try {
			in = openFileInput("myParkedCarFlag");
			in.close();
		} catch (FileNotFoundException e) {
			latitude = intent.getStringExtra("latitude");
			longitude = intent.getStringExtra("longitude");
			flagFile = false;
			storeFlag("myParkedCarFlag");
		} catch (IOException e) {
			throw new EmelException("error: IO exception");
		}
		
		if(flagFile){
			requestName = "/update?";	
			getURL = serverIP + requestName + "id=" + id;

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
			
			Log.v("Test-update","response");
			Toast.makeText(EmelService.this.context, "Server response: " + response, Toast.LENGTH_LONG).show();

			startService(new Intent(this, EmelWatchService.class));
			return;
		}

		requestName = "/park?";
		getURL = serverIP + requestName + "id="+id+"&long=" + longitude+"&lat=" + latitude;//URLEncoder.encode(new String(encoded));

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
		Toast.makeText(EmelService.this, "Server response: " + response, Toast.LENGTH_LONG).show();

		startService(new Intent(this, EmelWatchService.class));
	}

	@Override
	public IBinder onBind(Intent intent) {
		// TODO Auto-generated method stub
		return null;
	}


}
