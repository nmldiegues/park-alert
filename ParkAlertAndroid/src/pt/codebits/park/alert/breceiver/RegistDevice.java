package pt.codebits.park.alert.breceiver;

import pt.codebits.park.alert.comm.Authentication;
import pt.codebits.park.alert.comm.REST;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class RegistDevice extends BroadcastReceiver {
	   
	private String userToken;
	
	public RegistDevice(String token) {
		this.userToken = token;
	}
	
	@Override
	public void onReceive(final Context context, final Intent intent) {
		new Thread() {
			public void run() {
				String registrationID = intent.getStringExtra("registrationID");
				Log.w("DEBUG", "usertoken: "+userToken);
				Log.w("DEBUG", "ID: "+registrationID);
				Log.w("C2DM", REST.registDevice(context, Authentication.getTokenId(userToken), Authentication.getTokenValue(userToken), registrationID));
			}
		}.start();
	}
}   
