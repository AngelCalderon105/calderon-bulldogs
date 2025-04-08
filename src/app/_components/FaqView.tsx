"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import FaqArrow from "../../../public/FaqArrow.svg";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/ui/accordion";

interface FaqProps {
  isAdmin: boolean;
}

const FaqView: React.FC<FaqProps> = ({ isAdmin }) => {
  const {
    data: initialFaqs,
    isLoading,
    isError,
  } = api.faqs.listAllFaqs.useQuery();
  const createFaqMutation = api.faqs.createNewFaq.useMutation();
  const deleteFaqMutation = api.faqs.deleteFaq.useMutation();
  const editFaqMutation = api.faqs.updateFaq.useMutation();

  const [faqs, setFaqs] = useState(initialFaqs || []);
  const [showForm, setShowForm] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (initialFaqs) {
      setFaqs(initialFaqs);
    }
  }, [initialFaqs]);

  const handleCreateFaq = async () => {
    try {
      const newFaq = await createFaqMutation.mutateAsync({ question, answer });
      setFaqs([...faqs, newFaq]);
      setQuestion("");
      setAnswer("");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating FAQ:", error);
    }
  };

  const handleFaqDeletion = async (faqId: string) => {
    try {
      await deleteFaqMutation.mutateAsync({ id: faqId });
      setFaqs(faqs.filter((faq) => faq.id !== faqId));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const handleFaqUpdation = async (faqId: string) => {
    try {
      await editFaqMutation.mutateAsync({ id: faqId, question, answer });
      setFaqs(
        faqs.map((faq) =>
          faq.id === faqId ? { ...faq, question, answer } : faq,
        ),
      );
      setEditingFaqId(null);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  const handleEditClick = (
    faqId: string,
    currentQuestion: string,
    currentAnswer: string,
  ) => {
    setEditingFaqId(faqId);
    setQuestion(currentQuestion);
    setAnswer(currentAnswer);
  };

  if (isLoading) return <p>Loading FAQs...</p>;
  if (isError) return <p>Error fetching FAQs</p>;

  return (
    <div className="flex w-full flex-col py-12 font-montserrat">
      <h1 className="py-8 text-center text-2xl font-bold text-dark_blue sm:text-4xl">
        FAQs
      </h1>
      <Accordion type="single" collapsible>
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="m-3 text-gray-600 md:mx-3"
          >
            <AccordionTrigger className="[&>svg]:h-6 [&>svg]:w-6">
              <div className="flex w-full items-center justify-between">
                <h3 className="text-left text-lg font-semibold text-dark_blue sm:text-xl">
                  {faq.question}
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="gray_muted py-4 text-lg">
              {faq.answer}
              {isAdmin && (
                <div className="mt-4 flex space-x-2">
                  <button
                    className="rounded bg-gray-600 p-2 text-white"
                    onClick={() =>
                      handleEditClick(faq.id, faq.question, faq.answer)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red-600 p-2 text-white"
                    onClick={() => handleFaqDeletion(faq.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </AccordionContent>

            {editingFaqId === faq.id && (
              <div className="mb-4 mt-2">
                <label>
                  Question:
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="my-2 block w-full rounded border p-2"
                  />
                </label>
                <label>
                  Answer:
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="my-2 block w-full rounded border p-2"
                  />
                </label>
                <button
                  className="rounded bg-green-600 p-2 text-white"
                  onClick={() => handleFaqUpdation(faq.id)}
                >
                  Save
                </button>
                <button
                  className="ml-2 rounded bg-gray-400 p-2 text-white"
                  onClick={() => setEditingFaqId(null)}
                >
                  Cancel
                </button>
              </div>
            )}

            <hr className="mt-4 border-blue_pale opacity-30" />
          </AccordionItem>
        ))}
      </Accordion>

      {isAdmin && !editingFaqId && (
        <>
          <button
            className="mt-4 rounded bg-blue-600 p-4 text-white"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add new FAQ"}
          </button>

          {showForm && (
            <div style={{ marginTop: "20px" }}>
              <div>
                <label>
                  Question:
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="my-2 block w-full rounded border p-2"
                  />
                </label>
              </div>
              <div>
                <label>
                  Answer:
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="my-2 block w-full rounded border p-2"
                  />
                </label>
              </div>
              <button
                className="rounded bg-green-600 p-2 text-white"
                onClick={handleCreateFaq}
              >
                Submit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FaqView;
