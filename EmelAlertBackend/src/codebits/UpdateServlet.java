package codebits;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class UpdateServlet extends HttpServlet {

	public void doGet (HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

		String address = req.getParameter("address");
		String id = req.getParameter("id");

		UserParked u = Container.userCoord.get(id);
		u.setClientAddress(address);
		Container.userCoord.put(id, u);

		res.setContentType("text/html");
		PrintWriter out = res.getWriter();
		out.println("Received update request from id " + id + " to " + address);
	}

}