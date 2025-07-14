// frontend/app/talent-recognition/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import { Progress } from '@/components/progress'
import { RadioGroup, RadioGroupItem } from '@/components/radio-group'
import { Label } from '@/components/label'
import axios, { AxiosError } from 'axios'

declare global {
  interface Window {
    html2pdf: any;
  }
}

const OPTION_TO_SCORE: { [option: string]: number } = {
  "Not at all": 0, "Never": 0, "Rarely": 1, "Slightly": 1, "A little": 1,
  "Sometimes": 2, "Moderately": 2, "Neutral": 2, "Somewhat": 2,
  "Often": 3, "Very": 3, "Comfortable": 3, "Very confident": 3,
  "Extremely": 4, "Always": 4, "Very much": 4, "Extremely confident": 4,
  "Very comfortable": 4, "Slightly confident": 1, "Moderately confident": 2,
  "Indoors": 1, "Outdoors": 1, "People": 1, "Data": 1, "Tools": 1,
}

interface Question {
  id: number
  question_text: string
  category: string
  options: string[]
}

interface Recommendation {
  career_id: number
  title: string
  match_score: number
  courses: {
    title: string
    description: string
    link: string
  }[]
}

export default function TalentRecognitionPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({})
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [showAll, setShowAll] = useState(false)
  const [filterInterest, setFilterInterest] = useState<string>('All')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [pdfReady, setPdfReady] = useState(false) // <-- NEW
  const pdfRef = useRef(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/talent/questions')
        setQuestions(res.data)
      } catch (err) {
        const axiosErr = err as AxiosError
        alert(`Error fetching questions: ${axiosErr.response?.data || axiosErr.message}`)
      } finally {
        setLoading(false)
      }
    }

    const userIdFromLocalStorage = localStorage.getItem('userId')
    if (userIdFromLocalStorage) {
      setUserId(parseInt(userIdFromLocalStorage))
    } else {
      alert('User not authenticated. Please log in again.')
    }

    fetchQuestions()

    // Load PDF library script dynamically
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.async = true
    script.onload = () => {
      console.log('PDF library loaded')
      setPdfReady(true)
    }
    document.body.appendChild(script)
  }, [])

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    if (!userId) return alert('User not authenticated.')

    const formattedAnswers = Object.entries(answers).map(([qid, option]) => ({
      question_id: parseInt(qid),
      answer_value: OPTION_TO_SCORE[option] ?? 0,
    }))

    try {
      await axios.post('http://localhost:8000/api/talent/submit', {
        user_id: userId,
        answers: formattedAnswers,
      })
      await fetchRecommendations()
      setIsSubmitted(true)
    } catch (err) {
      alert('Error submitting answers.')
    }
  }

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/talent/recommend/${userId}`)
      setRecommendations(res.data)
    } catch {
      alert('Failed to fetch recommendations.')
    }
  }

  // const handleDownloadPDF = () => {
  //   if (!pdfReady) {
  //     alert('PDF library is still loading. Please wait a second and try again.')
  //     return
  //   }

  //   if (window.html2pdf && pdfRef.current) {
  //     const element = pdfRef.current as HTMLElement

  //     window.html2pdf()
  //       .set({
  //         margin: 0.5,
  //         filename: 'career_recommendations.pdf',
  //         image: { type: 'jpeg', quality: 0.98 },
  //         html2canvas: { scale: 2 },
  //         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  //       })
  //       .from(element)
  //       .save()
  //   } else {
  //     alert('PDF export failed. Please try again.')
  //   }
  // }

  const handleRetake = () => {
    setAnswers({})
    setCurrentIndex(0)
    setRecommendations([])
    setIsSubmitted(false)
    setShowAll(false)
    setFilterInterest('All')
  }

  const filteredRecs = recommendations.filter(r =>
    filterInterest === 'All' || r.title.toLowerCase().includes(filterInterest.toLowerCase())
  )

  const displayedRecs = showAll ? filteredRecs : filteredRecs.slice(0, 5)

  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (!questions.length) return <div className="p-6 text-center">No questions found.</div>

  const question = questions[currentIndex]

  return (
    <div className="relative min-h-screen bg-pink-50">
    {/* Background Image with low opacity */}
    <div className="absolute inset-0 z-0 bg-[url('/image2.avif')] bg-cover bg-center opacity-30" />

    {/* Overlay to ensure content stays readable */}
    <div className="relative z-10 max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-center text-purple-700">
        Discover Your Inner Potential
      </h1>

        {!isSubmitted ? (
          <>
            <Progress value={((currentIndex + 1) / questions.length) * 100} className="mb-6" />

            <Card className="mb-6 border-2 border-purple-300 shadow-md rounded-2xl bg-white">
              <CardContent className="py-6">
                <p className="text-lg font-semibold mb-4 text-gray-800">
                  {question.question_text}
                </p>
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={value => handleAnswer(question.id, value)}
                >
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 mb-2 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        answers[question.id] === option
                          ? 'bg-purple-100 border-purple-500 shadow-md'
                          : 'bg-white border-gray-300'
                      }`}
                      onClick={() => handleAnswer(question.id, option)}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button onClick={() => setCurrentIndex(currentIndex - 1)} disabled={currentIndex === 0}>
                Previous
              </Button>
              {currentIndex < questions.length - 1 ? (
                <Button onClick={() => setCurrentIndex(currentIndex + 1)} disabled={!answers[question.id]}>
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== questions.length || userId === null}
                >
                  Submit
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <Button
              onClick={() => window.location.href = '/user-dashboard'}
              className="absolute top-4 right-4 bg-purple-500 text-gray-800 hover:bg-violet-500 px-4 py-2 text-sm rounded-full shadow-md transition-all"
            >
              Home
            </Button>
            {/* Filter and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Filter Section */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Interest:</label>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={filterInterest}
                  onChange={e => setFilterInterest(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Tech">Tech</option>
                  <option value="Art">Art</option>
                  <option value="Health">Health</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {/* <Button onClick={() => setShowAll(!showAll)}>
                  {showAll ? 'Show Top 5' : 'See Full Report'}
                </Button>
                <Button onClick={handleDownloadPDF} disabled={!pdfReady}>
                  {pdfReady ? 'Download PDF' : 'Loading...'}
                </Button> */}
                <Button onClick={handleRetake} className="bg-purple-600 text-white hover:bg-purple-700 transition-all">
                  Retake Test
                </Button>
              </div>
            </div>

            {/* Recommendations Section */}
            <div ref={pdfRef} className="bg-white border rounded-2xl shadow p-6 space-y-6">
              {displayedRecs.length > 0 ? (
                displayedRecs.map((rec, idx) => (
                  <div key={idx} className="border-b pb-4 last:border-b-0">
                    <h3 className="text-xl font-semibold text-purple-700">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">Relevance: <span className="font-medium">{rec.match_score}%</span></p>
                    {rec.courses.length > 0 ? (
                      <ul className="list-disc list-inside space-y-2">
                        {rec.courses.map((course, i) => (
                          <li key={i}>
                            <a
                              href={course.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-medium hover:underline"
                            >
                              {course.title}
                            </a>
                            <p className="text-sm text-gray-500">{course.description}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm italic text-gray-500">No courses available.</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm italic text-gray-500">No recommendations found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
