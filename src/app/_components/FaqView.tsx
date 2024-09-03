"use client"
import React, { useState, useEffect } from 'react';
import { api } from "~/trpc/react";

interface FaqProps {
  isAdmin: boolean;
}

const FaqView: React.FC<FaqProps> = ({ isAdmin }) => {
  const { data: initialFaqs, isLoading, isError } = api.faqs.listAllFaqs.useQuery();
  const createFaqMutation = api.faqs.createNewFaq.useMutation();
  
  const [faqs, setFaqs] = useState(initialFaqs || []);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Update the local FAQ list when initialFaqs changes
  useEffect(() => {
    if (initialFaqs) {
      setFaqs(initialFaqs);
    }
  }, [initialFaqs]);

  const handleCreateFaq = async () => {
    try {
      const newFaq = await createFaqMutation.mutateAsync({ question, answer });
      setFaqs([...faqs, newFaq]); // Add the new FAQ to the existing list
      setQuestion(''); // Clear the input fields after successful submission
      setAnswer('');
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error("Error creating FAQ:", error);
    }
  };

  if (isLoading) return <p>Loading FAQs...</p>;
  if (isError) return <p>Error fetching FAQs</p>;

  return (
    <div className='mx-12 py-12'>
      <h1 className='py-8 font-bold'>Frequently Asked Questions</h1>
      {faqs.map((faq) => (
        <div key={faq.id} style={{ marginBottom: '20px' }}>
          <hr />
          <h3 className='font-medium py-4'>{faq.question}</h3>
          <p className='italic py-4'>{faq.answer}</p>
          
        </div>
      ))}

      {isAdmin && (
        <>
          <button className="mt-4 p-4 bg-blue-600 text-white rounded" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add new FAQ'}
          </button>

          {showForm && (
            <div style={{ marginTop: '20px' }}>
              <div>
                <label>
                  Question:
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Answer:
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </label>
              </div>
              <button onClick={handleCreateFaq}>Submit</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FaqView;
