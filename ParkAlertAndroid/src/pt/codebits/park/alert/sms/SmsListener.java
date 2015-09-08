package pt.codebits.park.alert.sms;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import pt.codebits.park.alert.breceiver.C2DMMessageReceiver;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

public class SmsListener extends BroadcastReceiver{

	@Override
	public void onReceive(Context context, Intent intent) {
		if(!intent.getAction().equals("android.provider.Telephony.SMS_RECEIVED")){
			return;
		}
		
		//this stops notifications to others
//	    this.abortBroadcast();
		
		Bundle bundle = intent.getExtras();
		SmsMessage[] msgs = null;
		String msg_from;
		if (bundle != null){
			try{
				Object[] pdus = (Object[]) bundle.get("pdus");
				msgs = new SmsMessage[pdus.length];
				for(int i = 0; i < msgs.length; i++){
					msgs[i] = SmsMessage.createFromPdu((byte[])pdus[i]);
					msg_from = msgs[i].getOriginatingAddress();
					String msgBody = msgs[i].getMessageBody();
					Log.d("SMS Listener", "From: " + msg_from + "| Content: " + msgBody);
					
					if (msg_from.equals("ParkAlert")) { 
							
							//get the url, unshorten it, and get the nid from it
							String url = "";
							String nid = "";
							
							Pattern pattern = Pattern.compile("http://goo.gl/[a-zA-Z0-9]+");
							Matcher matcher = pattern.matcher(msgBody);
							while (matcher.find())
								url = matcher.group();
							
							Log.d("SMS Listener", "Url: " + url);
						
							String longURL = unshortenUrl(url);
							
							Log.d("SMS Listener", "Long Url: " + longURL);
							
							Pattern pattern2 = Pattern.compile("&nid=([0-9]+)");
							Matcher matcher2 = pattern2.matcher(longURL);
							while (matcher2.find())
								nid=matcher2.group(1);
							
							// TODO: complete this
							String lat = "", longi = "";
							Pattern pattern3 = Pattern.compile("&ll=([0-9]+),([0-9]+)&z");
							Matcher matcher3 = pattern3.matcher(longURL);
							while (matcher3.find()) {
								lat=matcher3.group(1);
								longi=matcher3.group(2);
							}
							
							Log.d("SMS Listener", "nid: " + nid);
							
					 		C2DMMessageReceiver.createNotification(context, 
					 				"Alerta! Reportado um funcion‡rio perto do seu carro", nid, lat, longi);
					}
					
					
				}
			}catch(Exception e){
				Log.d("Exception caught",e.getMessage());
			}
		}
		
//		if (something) {
//			//continue the normal process of sms and will get alert and reaches inbox
//            this.clearAbortBroadcast();
//		}
	}
	
	public String unshortenUrl(String url) {
		String longUrl = "";
		URL googleURL;
		try {
			googleURL = new URL("https://www.googleapis.com/urlshortener/v1/url?shortUrl="+url);
			URLConnection conn = googleURL.openConnection();
			BufferedReader in = new BufferedReader(new InputStreamReader(
                    conn.getInputStream()));

            String line;
            while ((line = in.readLine()) != null) {
            	if (line.contains("longUrl")) {
            		String s = line.substring(line.indexOf(":")+3).replace("\",", ""); //TODO: Oh God Why, this is such a bad hack but I can't be arsed to fix it after midnight
            		return s;
            	}
            }
			
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		
		return longUrl;
	}
	
	
}
