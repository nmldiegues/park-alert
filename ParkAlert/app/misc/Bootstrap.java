package misc;

import play.jobs.Job;
import play.jobs.OnApplicationStart;

@OnApplicationStart
public class Bootstrap extends Job {

    @Override
    public void doJob() throws Exception {
        //MsnConversation conv = new MsnConversation("Hello World Conversation");
        //conv.save();
    }
	
}
