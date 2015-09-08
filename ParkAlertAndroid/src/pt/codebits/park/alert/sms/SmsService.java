package pt.codebits.park.alert.sms;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.IBinder;

public class SmsService extends Service {

	private volatile BroadcastReceiver receiver;
	
	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		if (receiver != null) {
			unregisterReceiver(receiver);
		}
		IntentFilter filter = new IntentFilter();
		filter.addAction("android.provider.Telephony.SMS_RECEIVED");
		filter.setPriority(2147483647);
		receiver = new SmsListener();
		registerReceiver(receiver, filter);
		
		return super.onStartCommand(intent, flags, startId);
	}
	
	@Override   
	public void onDestroy() {   
		unregisterReceiver(receiver);
	}

	@Override
	public IBinder onBind(Intent intent) {
		if (receiver != null) {
			unregisterReceiver(receiver);
		}
		
		IntentFilter filter = new IntentFilter();
		filter.addAction("android.provider.Telephony.SMS_RECEIVED");
		filter.setPriority(2147483647);
		receiver = new SmsListener();
		registerReceiver(receiver, filter);
		
		return null;
	}


}
