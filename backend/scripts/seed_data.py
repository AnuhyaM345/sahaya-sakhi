# backend/scripts/seed_data.py

from sqlalchemy.orm import Session
from backend.db.session import SessionLocal
from backend.db.tables import TalentCategory, CareerPath, Course, Question

def seed_data(db: Session):
    # --- 1. Talent Categories ---
    talent_categories = [
        TalentCategory(name="Empathy", description="Understanding and sharing the feelings of others."),
        TalentCategory(name="Creativity", description="Ability to think outside the box and generate innovative ideas."),
        TalentCategory(name="Logical Thinking", description="Structured problem solving, analysis, and reasoning."),
        TalentCategory(name="Communication", description="Effective verbal and written communication skills."),
        TalentCategory(name="Leadership", description="Ability to lead, motivate and manage teams or projects."),
        TalentCategory(name="Technical Aptitude", description="Interest and skills in technology, hardware, and software.")
    ]
    db.add_all(talent_categories)
    db.commit()

    # Map talent categories by name
    talent_map = {tc.name: tc for tc in db.query(TalentCategory).all()}

    # --- 2. Career Paths ---
    career_paths = [
        # Empathy-based careers
        CareerPath(name="Social Worker", description="Helping individuals and families cope with challenges.", talent_category_id=talent_map["Empathy"].id),
        CareerPath(name="Counselor", description="Providing guidance and support through counseling.", talent_category_id=talent_map["Empathy"].id),
        CareerPath(name="Nurse", description="Caring for patients and providing critical support in health care.", talent_category_id=talent_map["Empathy"].id),

        # Creativity-based careers
        CareerPath(name="Designer", description="Creating visual concepts for various media.", talent_category_id=talent_map["Creativity"].id),
        CareerPath(name="Content Creator", description="Developing engaging content across digital platforms.", talent_category_id=talent_map["Creativity"].id),
        CareerPath(name="Illustrator", description="Producing creative illustrations for books, media, and advertising.", talent_category_id=talent_map["Creativity"].id),

        # Logical Thinking-based careers
        CareerPath(name="Software Developer", description="Designing and building software solutions.", talent_category_id=talent_map["Logical Thinking"].id),
        CareerPath(name="Data Analyst", description="Interpreting data to help businesses make strategic decisions.", talent_category_id=talent_map["Logical Thinking"].id),
        CareerPath(name="Financial Analyst", description="Analyzing financial data to support decision-making.", talent_category_id=talent_map["Logical Thinking"].id),

        # Communication-based careers
        CareerPath(name="Public Speaker", description="Delivering speeches and presentations to large audiences.", talent_category_id=talent_map["Communication"].id),
        CareerPath(name="Journalist", description="Researching and reporting news and stories.", talent_category_id=talent_map["Communication"].id),
        CareerPath(name="Customer Support Specialist", description="Assisting customers and resolving issues effectively.", talent_category_id=talent_map["Communication"].id),

        # Leadership-based careers
        CareerPath(name="Project Manager", description="Planning and executing projects from conception to completion.", talent_category_id=talent_map["Leadership"].id),
        CareerPath(name="Entrepreneur", description="Starting and managing new business ventures.", talent_category_id=talent_map["Leadership"].id),
        CareerPath(name="Community Organizer", description="Mobilizing and leading community initiatives.", talent_category_id=talent_map["Leadership"].id),

        # Technical Aptitude-based careers
        CareerPath(name="Network Engineer", description="Designing and maintaining network infrastructure.", talent_category_id=talent_map["Technical Aptitude"].id),
        CareerPath(name="Web Developer", description="Building and maintaining websites.", talent_category_id=talent_map["Technical Aptitude"].id),
        CareerPath(name="Cybersecurity Analyst", description="Protecting systems and networks from cyber threats.", talent_category_id=talent_map["Technical Aptitude"].id)
    ]
    db.add_all(career_paths)
    db.commit()

    # Map career names for linking courses
    career_map = {cp.name: cp for cp in db.query(CareerPath).all()}

    # --- 3. Courses ---
    courses = [
        # Empathy
        Course(title="Foundations of Social Work", description="An introduction to social work practice.", link="https://example.com/social-work", talent_category_id=career_map["Social Worker"].talent_category_id),
        Course(title="Effective Counseling Techniques", description="Learn the basics of counseling and therapy.", link="https://example.com/counseling", talent_category_id=career_map["Counselor"].talent_category_id),
        Course(title="Nursing Essentials", description="Fundamental skills and knowledge for nursing.", link="https://example.com/nursing", talent_category_id=career_map["Nurse"].talent_category_id),

        # Creativity
        Course(title="Graphic Design Masterclass", description="Become a professional graphic designer.", link="https://example.com/graphic-design", talent_category_id=career_map["Designer"].talent_category_id),
        Course(title="Content Creation for Digital Media", description="Techniques for creating engaging digital content.", link="https://example.com/content-creation", talent_category_id=career_map["Content Creator"].talent_category_id),
        Course(title="Illustration Techniques", description="Learn drawing and illustration techniques.", link="https://example.com/illustration", talent_category_id=career_map["Illustrator"].talent_category_id),

        # Logical Thinking
        Course(title="Full-Stack Software Development", description="From fundamentals to advanced software development.", link="https://example.com/software-development", talent_category_id=career_map["Software Developer"].talent_category_id),
        Course(title="Data Analysis with Python", description="Analyze data using Python tools and libraries.", link="https://example.com/data-analysis", talent_category_id=career_map["Data Analyst"].talent_category_id),
        Course(title="Financial Analysis and Modeling", description="Develop skills in analyzing and modeling financial data.", link="https://example.com/financial-analysis", talent_category_id=career_map["Financial Analyst"].talent_category_id),

        # Communication
        Course(title="Public Speaking Essentials", description="Improve your public speaking and presentation skills.", link="https://example.com/public-speaking", talent_category_id=career_map["Public Speaker"].talent_category_id),
        Course(title="Journalism and Reporting", description="Learn the art of investigative journalism.", link="https://example.com/journalism", talent_category_id=career_map["Journalist"].talent_category_id),
        Course(title="Customer Service Excellence", description="Techniques to excel in customer support and communication.", link="https://example.com/customer-support", talent_category_id=career_map["Customer Support Specialist"].talent_category_id),

        # Leadership
        Course(title="Project Management Professional (PMP) Prep", description="Get ready for PMP certification and beyond.", link="https://example.com/project-management", talent_category_id=career_map["Project Manager"].talent_category_id),
        Course(title="Entrepreneurship 101", description="Start and run your own business successfully.", link="https://example.com/entrepreneurship", talent_category_id=career_map["Entrepreneur"].talent_category_id),
        Course(title="Community Leadership and Organizing", description="Learn how to mobilize community efforts.", link="https://example.com/community-organizing", talent_category_id=career_map["Community Organizer"].talent_category_id),

        # Technical Aptitude
        Course(title="Network Engineering Fundamentals", description="Core concepts of network design and management.", link="https://example.com/network-engineering", talent_category_id=career_map["Network Engineer"].talent_category_id),
        Course(title="Modern Web Development", description="Build responsive and scalable websites.", link="https://example.com/web-development", talent_category_id=career_map["Web Developer"].talent_category_id),
        Course(title="Cybersecurity Basics", description="Introduction to cybersecurity principles and practices.", link="https://example.com/cybersecurity", talent_category_id=career_map["Cybersecurity Analyst"].talent_category_id),
    ]
    db.add_all(courses)
    db.commit()

    # --- 4. Questions ---
    question_data = {
        "Empathy": [
            "I enjoy helping others solve their problems.",
            "I can easily understand how others feel.",
            "I feel fulfilled when I support someone emotionally.",
            "People often come to me for emotional support.",
            "I remain calm and comforting in tense situations.",
            "I feel a strong need to improve the lives of people around me.",
            "I naturally comfort those who are upset.",
            "I enjoy volunteering or engaging in community service."
        ],
        "Creativity": [
            "I often come up with new ideas or solutions.",
            "I enjoy creating art, music, or stories.",
            "I see patterns or possibilities that others might miss.",
            "I enjoy designing things.",
            "I think outside the box to solve problems.",
            "I get inspired by nature, art, or culture.",
            "I enjoy photography, sketching, or video editing.",
            "I like working on DIY or crafting projects."
        ],
        "Logical Thinking": [
            "I like working with logic and patterns.",
            "I enjoy solving puzzles or writing code.",
            "I prefer structured tasks with clear rules.",
            "I like working with numbers or data.",
            "I enjoy breaking down complex problems into smaller parts.",
            "I like analyzing why things work the way they do.",
            "I find math or logic-based games fun.",
            "I value precision and accuracy in tasks."
        ],
        "Communication": [
            "I am comfortable speaking in front of groups.",
            "I express my ideas clearly in speech and writing.",
            "I enjoy having conversations with diverse groups of people.",
            "I can simplify complex topics when explaining them.",
            "I like debating or confidently sharing my opinions.",
            "I enjoy writing, blogging, or storytelling.",
            "I actively participate in group discussions.",
            "I frequently use social media or other platforms to express ideas."
        ],
        "Leadership": [
            "I naturally take charge during group tasks.",
            "I enjoy motivating others to achieve common goals.",
            "I am confident in making decisions for a team.",
            "I enjoy organizing or leading events.",
            "I think strategically to set long-term goals.",
            "I effectively handle conflicts within a group.",
            "I am seen as responsible and dependable by my peers.",
            "I often take the initiative without being asked."
        ],
        "Technical Aptitude": [
            "I am interested in how computers or machines work.",
            "I enjoy building or repairing electronic devices.",
            "I can quickly learn new technologies.",
            "I like experimenting with different software or apps.",
            "I enjoy working with modern tech tools or gadgets.",
            "I regularly follow cybersecurity or tech innovation news.",
            "I understand how various systems and networks connect.",
            "I enjoy solving technical problems that others find challenging."
        ]
    }

    all_questions = [
        Question(question_text=qt, category=cat)
        for cat, questions in question_data.items()
        for qt in questions
    ]
    db.add_all(all_questions)
    db.commit()

    print("✅ Seeding completed successfully!")

def main():
    db = SessionLocal()
    try:
        seed_data(db)
    except Exception as e:
        print("❌ Error during seeding:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
