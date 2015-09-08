package misc;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Queue;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.xml.soap.MessageFactory;
import javax.xml.soap.MimeHeaders;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPConnection;
import javax.xml.soap.SOAPConnectionFactory;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import models.Notification;
import models.Report;
import models.SMS;
import models.User;

public class SMSUtils {
	
	private final static Logger LOGGER = Logger.getLogger("MessageLog");

	public static void sendSMS(User destination, Report report) {
		double latitude = report.latitude;
		double longitude = report.longitude;
		
		LOGGER.setLevel(Level.INFO);
		LOGGER.info("Tying to send SMS.");
		
		Notification notif = new Notification(destination, report.user, new Date(), latitude, longitude, "sms");
		notif.save();
		destination.notifications.add(notif);
		destination.save();
		
		String locationURL = urlifyMap(notif.id, latitude, longitude);
		
		//@Alex TODO: Check if the phone number already has +351 !
		String request = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:market=\"http://services.sapo.pt/Metadata/Market\" xmlns:def=\"http://services.sapo.pt/definitions\" xmlns:urn=\"urn:oma:wsdl:pxprof:sms:1.0:send:interface:local\">"+
				"<soapenv:Header>"+
					"<def:ESBCredentials>"+
						"<def:ESBUsername>emelalert@sapo.pt</def:ESBUsername>" +
						"<def:ESBPassword>3m3lAL3RT</def:ESBPassword>"+
					"</def:ESBCredentials>"+
					"<market:ESBAccessKey>BCA3071E-ECA6-4608-8CDC-679091EE7764</market:ESBAccessKey>"+
				"</soapenv:Header>"+
				"<soapenv:Body>"+
					"<urn:sendSms>"+
						"<urn:addresses>tel:+351"+destination.cellphone+"</urn:addresses>"+
						"<urn:senderName>ParkAlert</urn:senderName>"+
						"<urn:message>ParkAlert SMS Service! Somebody saw something at "+locationURL+" </urn:message>"+
					"</urn:sendSms>"+
				"</soapenv:Body>"+
			"</soapenv:Envelope>";
		
		//First create the connection
        SOAPConnectionFactory soapConnFactory;
		try {
			soapConnFactory = SOAPConnectionFactory.newInstance();
		
	        SOAPConnection connection = 
	                            soapConnFactory.createConnection();
	        
	        //Next, create the actual message
	        MessageFactory messageFactory = MessageFactory.newInstance();
	        SOAPMessage message = messageFactory.createMessage();
	        
	        //Create objects for the message parts            
	        SOAPPart soapPart =     message.getSOAPPart();
	        SOAPEnvelope envelope = soapPart.getEnvelope();
	        SOAPBody body =         envelope.getBody();
	        
	        StreamSource preppedMsgSrc = new StreamSource(new StringReader(request));
	        soapPart.setContent(preppedMsgSrc);
	        
	        MimeHeaders mimeHeader = message.getMimeHeaders();
	        mimeHeader.setHeader("SOAPAction", "urn:oma:wsdl:pxprof:sms:1.0:send:interface:local/sendSms");
	        
	        String dest = "http://services.sapo.pt/OneAPI/SMS/SendSMS";
	        
	        //Send the message
	        SOAPMessage reply = connection.call(message, dest);
	        
	        //assuming all goes well
	        String smsID = reply.getSOAPBody().getFirstChild().getFirstChild().getTextContent();
	            
	        //Close the connection            
	        connection.close();
	        
	        LOGGER.setLevel(Level.INFO);
			LOGGER.info("Sent SMS number "+smsID+" to "+destination.username+", "+destination.cellphone);
			LOGGER.info("Remaining SMSs in this packet: "+(5000-Integer.parseInt(smsID)));
			
		} catch (UnsupportedOperationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SOAPException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	private static String urlifyMap(Long nid, double latitude, double longitude) {
		
		String url = "http://mapas.sapo.pt/cmap/cmap.html?sz=640,960&ll="+latitude+","+longitude+"&z=16&t=m&mks="+longitude+","+latitude+",0,asd,"+"&nid="+nid;
		
		return shortenUrl(url);
	}

	private static String shortenUrl(String url) {
		String shortUrl = "";

	    try
	    {
	        URLConnection conn = new URL("https://www.googleapis.com/urlshortener/v1/url").openConnection();
	        conn.setDoOutput(true);
	        conn.setRequestProperty("Content-Type", "application/json");
	        OutputStreamWriter wr = 
	                     new OutputStreamWriter(conn.getOutputStream());
	        wr.write("{\"longUrl\":\"" + url + "\"}");
	        wr.flush();

	        // Get the response
	        BufferedReader rd = 
	                     new BufferedReader(
	                     new InputStreamReader(conn.getInputStream()));
	        String line;

	        while ((line = rd.readLine()) != null)
	        {
	            if (line.indexOf("id") > -1)
	            {
	            	//hack
	                shortUrl = line.substring(8, line.length() - 2);
	                break;
	            }
	        }

	        wr.close();
	        rd.close();
	    }
	    catch (MalformedURLException ex)
	    {
	    	ex.printStackTrace();
	    }
	    catch (IOException ex)
	    {
	       ex.printStackTrace();      
	    }
	    
	   return shortUrl;
		
	}	
	
	
}
