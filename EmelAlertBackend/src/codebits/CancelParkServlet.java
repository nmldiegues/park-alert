package codebits;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class CancelParkServlet extends HttpServlet {

	public void doGet (HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

		String id = req.getParameter("id");

		Container.userCoord.remove(Container.userCoord.get(id));

		res.setContentType("text/html");
		PrintWriter out = res.getWriter();
		out.println("Cancelled park with id: " + id);
	}

}