package codebits;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class RefuseServlet  extends HttpServlet {

	public void doGet (HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

		Long id = Long.parseLong(req.getParameter("id"));

		if (Container.userReports.containsKey(id)) {
			String userIdThatReported = Container.userReports.get(id);
			if(Container.userRank.containsKey(userIdThatReported)) {
				Container.userRank.put(userIdThatReported, Container.userRank.get(userIdThatReported)-1);
			} else {
				Container.userRank.put(userIdThatReported, -1);
			}
		}

		res.setContentType("text/html");
		PrintWriter out = res.getWriter();
		out.println("Received confirmation of report id: " + id);
	}

}