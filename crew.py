from crewai import Agent, Task, Crew, Process
from crewai_tools import (
    ScrapeWebsiteTool
)
from pydantic import BaseModel

class SeoMetadata(BaseModel):
    title: str
    description: str
    keywords: list[str]

class SeoCrew():
    scrape_tool = ScrapeWebsiteTool()

    title_agent = Agent(
        role="SEO Specialist",
        goal="To write SEO metadata that are highly relevant to the content provided.",
        backstory="You are an SEO Specialist responsible for optimizing content for search engines. You have access to a variety of tools to help you with scraping website content, keyword research, content optimization, and performance tracking.",
        reasoning=False,
        verbose=True
    )

    extract_task = Task(
        description="Extract content from a webpage at {url}.",
        expected_output="Your output should be the main content of the webpage, excluding any advertisements or unrelated information.",
        agent=title_agent,
        tools=[scrape_tool]
    )

    write_task = Task(
        description="Write SEO metadata for a webpage.",
        expected_output="A JSON object with 'title' and 'description' fields and a list of 'keywords' that are relevant to the content of the webpage.",
        agent=title_agent,
        context=[extract_task],
        output_json=SeoMetadata
    )

    def crew(self) -> Crew:
        """Creates the crew"""
        return Crew(
            agents=[self.title_agent],
            tasks=[self.extract_task, self.write_task],
            verbose=True,
            process=Process.sequential
        )