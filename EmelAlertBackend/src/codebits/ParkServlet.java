package codebits;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class ParkServlet extends HttpServlet {

	public void doGet (HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

		String longitude = req.getParameter("long");
		String latitude = req.getParameter("lat");
		String id = req.getParameter("id");

		//Debug.log(this, "[ParkServlet]: longitude: " + longitude + " latitude: " + latitude + " id: " + id);
		
		Container.userCoord.put(id, new UserParked(new Double(longitude), new Double(latitude), false, id, req.getRemoteAddr()));

		res.setContentType("text/html");
		PrintWriter out = res.getWriter();
		out.println("Received parking request long: " + longitude + "; lat: " + latitude + " with user id: " + id);
	}

}