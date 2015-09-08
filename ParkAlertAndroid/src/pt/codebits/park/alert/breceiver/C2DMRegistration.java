package pt.codebits.park.alert.breceiver;

import pt.codebits.park.alert.MainMapActivity;
import android.R;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

public class C2DMRegistration extends BroadcastReceiver {
	
	@Override
	public void onReceive(Context context, Intent intent) {
		String action = intent.getAction();
		Log.w("C2DM", "Registration Receiver called");
		if ("com.google.android.c2dm.intent.REGISTRATION".equals(action)) {
			Log.w("C2DM", "Received registration ID");
			
			final String registrationId = intent.getStringExtra("registration_id");
			if (intent.getStringExtra("error") != null) {
				Log.w("C2DM", "Received registration ID ERROR");
				return;
			}
			String error = intent.getStringExtra("error");
			Log.d("C2DM", "dmControl: registrationId = " + registrationId+ ", error = " + error);
			Intent intentID = new Intent();
			intentID.setAction(MainMapActivity.REGIST_DEVICE_FILTER);
			intentID.putExtra("registrationID", registrationId);
			context.sendBroadcast(intentID);
		}
	}
	
	public void createNotification(Context context, String registrationId) {
		NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		Notification notification = new Notification(R.drawable.ic_menu_info_details, "Registration successful", System.currentTimeMillis());
		// Hide the notification after its selected
		notification.flags |= Notification.FLAG_AUTO_CANCEL;

		Intent intent = new Intent(context, C2DMRegistration.class);
		intent.putExtra("registration_id", registrationId);
		PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);
		notification.setLatestEventInfo(context, "Registration", "Successfully registered", pendingIntent);
		notificationManager.notify(0, notification);
	}
}