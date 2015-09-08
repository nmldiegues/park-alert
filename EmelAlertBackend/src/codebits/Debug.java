package codebits;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServlet;


public class Debug {

	public static volatile String buffer = "";

	public static void log(HttpServlet servlet, String msg) {
		buffer += msg + "\n";
	}
	
	public static void commit(HttpServlet servlet) {
		BufferedWriter out = null;
		try{
    		FileWriter fileWritter = new FileWriter(new File("/root/apache-tomcat-5.5.34/webapps/backend/log-file.out").getName(),true);
	        BufferedWriter bufferWritter = new BufferedWriter(fileWritter);
	        DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
	        Date date = new Date();
	        String data = "[" + dateFormat.format(date) + "] " +  buffer + "\n";
	        bufferWritter.write(data);
	        bufferWritter.close();
		}catch (Exception e){
			System.err.println("Error: " + e.getMessage());
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			buffer = null;
		}
	}
	
}
