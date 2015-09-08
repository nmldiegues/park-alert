package pt.codebits.park.alert.breceiver;

import pt.codebits.park.alert.MainMapActivity;
import android.R;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

public class C2DMMessageReceiver extends BroadcastReceiver {

	public static volatile NotificationInformation notif = null;
	
	public static class NotificationInformation {
		public String nid;
		public String latitude;
		public String longitude;
	}
	
	@Override
	public void onReceive(Context context, Intent intent) {
		String action = intent.getAction();
		Log.w("C2DM", "Message Receiver called");
		if ("com.google.android.c2dm.intent.RECEIVE".equals(action)) {
			Log.w("C2DM", "Received message");
			final String payload = intent.getStringExtra("payload");
			//Toast.makeText(context, "dmControl: payload = " + payload, Toast.LENGTH_LONG).show();
			Log.d("C2DM", "dmControl: payload = " + payload);
			createNotification(context, payload, payload.split(":")[1], payload.split(":")[2], payload.split(":")[3]); //hack
		}
	}
	
	public static void createNotification(Context context, String msg, String nid, String latitude, String longitude) {
		NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		//Notification notification = new Notification(R.drawable.ic_menu_info_details, msg, System.currentTimeMillis());
		// Hide the notification after its selected
		//notification.flags |= Notification.FLAG_AUTO_CANCEL;

		Intent intent = new Intent(context, MainMapActivity.class);
		intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
		intent.putExtra("msg", msg);
		intent.putExtra("nid", nid);
		intent.putExtra("latitude", latitude);
		intent.putExtra("longitude", longitude);
		
		PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);
		//notification.setLatestEventInfo(context, "Alerta!", "Reportado um funcionário perto do seu carro", pendingIntent);
		//notificationManager.notify(0, notification);
		
		NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
		builder.setContentTitle("Alerta!").setContentText("Reportado um funcionário perto do seu carro").setContentIntent(pendingIntent).
		setAutoCancel(true).setSmallIcon(R.drawable.ic_menu_info_details);
		
		Notification notification = builder.build();
		notificationManager.notify(Integer.parseInt(nid), notification);
		
		notif = new NotificationInformation();
		notif.latitude = latitude;
		notif.longitude = longitude;
		notif.nid = nid;
		
	}
}