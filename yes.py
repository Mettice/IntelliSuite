import os
from dotenv import load_dotenv
from langchain_openai import OpenAI  
from crewai import Agent, Task, Crew



# Load environment variables
load_dotenv()



class LeadQualificationSystem:
    def __init__(self):
        # Initialize OpenAI
        self.llm = OpenAI(
            temperature=0.2,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Define our specialized agents
        self.lead_analyzer = Agent(
            role='Lead Analyzer',
            goal='Analyze lead information for qualification',
            backstory='Expert at analyzing lead quality and potential',
            llm=self.llm,
            verbose=True
        )
        
        self.market_researcher = Agent(
            role='Market Researcher',
            goal='Research company and market context',
            backstory='Expert at gathering and analyzing market information',
            llm=self.llm,
            verbose=True
        )
        
        self.decision_maker = Agent(
            role='Decision Maker',
            goal='Make final qualification decision',
            backstory='Expert at evaluating leads and making qualification decisions',
            llm=self.llm,
            verbose=True
        )

    def analyze_lead(self, lead_data):
        # Create tasks for our agents
        analysis_task = Task(
            description=f"""
            Analyze this lead information and provide an initial assessment:
            {lead_data}
            Focus on: budget indicators, decision-making authority, timeline
            """,
            agent=self.lead_analyzer,
            expected_output="A detailed analysis of the lead including budget assessment, authority level, and timeline evaluation."
        )

        research_task = Task(
            description=f"""
            Research the company and market context for this lead:
            {lead_data}
            Provide insights on: company size, industry position, potential value
            """,
            agent=self.market_researcher,
            expected_output="A comprehensive market and company research report including size, position, and potential value."
        )

        decision_task = Task(
            description="""
            Review the analysis and research. Make a final qualification decision.
            Provide a score from 1-10 and key reasons for the decision.
            """,
            agent=self.decision_maker,
            expected_output="A final qualification decision with a score (1-10) and detailed justification."
        )

        # Create crew and execute tasks
        crew = Crew(
            agents=[self.lead_analyzer, self.market_researcher, self.decision_maker],
            tasks=[analysis_task, research_task, decision_task],
            verbose=True
        )

        decision_made = False
        
        result = crew.kickoff()
        for task_output in result.tasks_output:
            if task_output.agent == self.decision_maker and not decision_made:
                decision_made = True
                # Process and return the Decision Maker output only once
                return self._parse_result(task_output.output)

        # If Decision Maker wasn't executed due to earlier exits, return the full Crew output
        return self._parse_result(result)

    def _parse_result(self, result):
        # Extract score and create structured output
        return {
            'qualification_score': self._extract_score(result),
            'full_analysis': result,
            'status': self._determine_status(self._extract_score(result))
        }

    def _extract_score(self, result):
        try:
            import re
            scores = re.findall(r'(?:score:?\s*)?([1-9]|10)(?:/10)?', result.lower())
            return int(scores[0]) if scores else 5
        except:
            return 5  # Default middle score if parsing fails

    def _determine_status(self, score):
        if score >= 8: return "HOT"
        elif score >= 6: return "WARM"
        else: return "COLD"

# Example usage
if __name__ == "__main__":
    qualifier = LeadQualificationSystem()
    
    # Example lead data
    lead_data = {
        "name": "John Doe",
        "company": "Tech Corp",
        "email": "john@techcorp.com",
        "message": "Interested in enterprise automation solution. Budget >$100k",
        "source": "Website Contact Form"
    }
    
    result = qualifier.analyze_lead(lead_data)
    print("Qualification Result:", result)