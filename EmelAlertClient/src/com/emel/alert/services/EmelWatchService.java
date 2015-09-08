package com.emel.alert.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;

import com.emel.alert.NotifyUserActivity;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

public class EmelWatchService extends Service{

	private static final int CLIENT_PORT = 22222;
	public static volatile Thread thread;

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		//String id = intent.getExtras().getString("id");

		synchronized (EmelWatchService.class) {
			if (thread == null) {
				final ServerSocketChannel ssChannel;
				try {
					ssChannel = ServerSocketChannel.open();
					ssChannel.configureBlocking(false);
					ssChannel.socket().bind(new InetSocketAddress(CLIENT_PORT));


					thread = new Thread() {
						@Override
						public void run() {
							SocketChannel sChannel = null;
							while(true) {
								try {
									sChannel = ssChannel.accept();
									if (sChannel == null) {
										if (Thread.currentThread().isInterrupted()) {
											Log.v("Test","Shutting down EmelWatchService...");
											return;
										}
										continue;
									}

									BufferedReader in = new BufferedReader(new InputStreamReader (sChannel.socket().getInputStream()));
									String incomingContent = "";
									String tmp;
									while ((tmp = in.readLine()) != null) {
										incomingContent += tmp;
										Log.v("SOCKET", incomingContent);
									}
									handleNotification(incomingContent);

								} catch (IOException e) {
									e.printStackTrace();
									return;
								} finally {
									try {
										if (sChannel != null) {
											sChannel.close();
										}
									} catch (IOException e) {
										e.printStackTrace();
									}
								}
							}
						}

						private void handleNotification(String content) {
							NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

							//instantiate the notification
							int icon = android.R.drawable.ic_menu_info_details;
							CharSequence tickerText = "EMEL employee spotted!";
							long when = System.currentTimeMillis();

							Notification notification = new Notification(icon, tickerText, when);

							Context context = getApplicationContext();
							CharSequence contentTitle = "EMEL Alert!";
							CharSequence contentText = "Someone has seen an EMEL employee near your car!";

							Intent notificationIntent = new Intent(EmelWatchService.this, NotifyUserActivity.class);
							notificationIntent.putExtra("location", content);

							PendingIntent contentIntent = PendingIntent.getActivity(EmelWatchService.this, 0, notificationIntent, 0);

							notification.setLatestEventInfo(context, contentTitle, contentText, contentIntent);

							mNotificationManager.notify(0, notification);
						}

					};
					thread.start();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}


		return 0;
	}

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

}
