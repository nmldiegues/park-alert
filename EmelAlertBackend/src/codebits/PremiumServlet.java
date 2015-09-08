package codebits;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class PremiumServlet extends HttpServlet {

	public void doGet (HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

		String id = req.getParameter("id");

		UserParked u = Container.userCoord.get(id);
		u.setPremium(true);
		Container.userCoord.put(id, u);

		res.setContentType("text/html");
		PrintWriter out = res.getWriter();
		out.println("User with id: " + id + " is now premiun");
	}

}