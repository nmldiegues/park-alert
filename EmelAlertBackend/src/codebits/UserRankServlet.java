package codebits;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class UserRankServlet extends HttpServlet {

	public void doGet (HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

		String ranks = "";
		int total = 10;
		
		HashMap<Integer, String> tmp = new HashMap<Integer, String>();
		
		for(String user : Container.userRank.keySet()) {
			tmp.put(Container.userRank.get(user), user);
		}
		
		Collection<Integer> value = Container.userRank.values();
		ArrayList<Integer> ranksList = new ArrayList<Integer>(value);
		Collections.sort(ranksList);
		
		for(Integer rank : ranksList) {
			if(total==0) {
				break;
			} else {
				total--;
				ranks = ranks + tmp.get(rank) + ";" + rank + ":";
			}
		}

		res.setContentType("text/html");
		PrintWriter out = res.getWriter();
		out.println(ranks);
	}

}