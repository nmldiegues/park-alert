package codebits;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class ReportServlet extends HttpServlet {

	public static volatile HttpServlet SERVLET;
	
	public void doGet (HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		SERVLET = this;
		
		String longitude = req.getParameter("long");
		String latitude = req.getParameter("lat");
		String id = req.getParameter("id");

		Debug.log(this, "[ReportServlet]: longitude: " + longitude + " latitude: " + latitude + " id: " + id);
		
		Container.warnUser(new Double(longitude),new Double(latitude), id, Container.newReportID());
		
		Debug.log(this, "[ReportServlet]: finished warning users");
		Debug.commit(this);
		res.setContentType("text/html");
		PrintWriter out = res.getWriter();
		out.println("Reported green guy at long: " + longitude + " ; lat: " + latitude + " by user: " + id);

	}

}