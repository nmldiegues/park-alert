package com.emel.receivers;

import com.emel.alert.services.EmelService;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.provider.Settings.Secure;
import android.widget.Toast;

public class ConnectionChangeReceiver extends BroadcastReceiver{
	public void onReceive(Context context, Intent intent){
	    ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
	    NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
	    
	    if (activeNetworkInfo != null){
	    	Toast.makeText( context, "Active Network Type : " + activeNetworkInfo.getTypeName(), Toast.LENGTH_SHORT ).show();
	    	Intent i = new Intent(context, EmelService.class);
	    	String androidID = Secure.getString(context.getContentResolver(), Secure.ANDROID_ID);
	    	i.putExtra("id", androidID);
	    	context.startService(i);
	    }
	}
}
