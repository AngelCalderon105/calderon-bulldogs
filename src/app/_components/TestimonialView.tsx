"use client";

import { useState, useRef } from "react";
import { api } from "~/trpc/react";

import { XIcon } from "lucide-react";

type RatingValue = 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

interface TestimonialViewProps {
  isAdmin: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  email: string;
  comment: string;
  rating: RatingValue;
  file: File;
}

const ratingValues: { [key: number]: any } = {
  1: "ONE",
  1.5: "ONE_HALF",
  2: "TWO",
  2.5: "TWO_HALF",
  3: "THREE",
  3.5: "THREE_HALF",
  4: "FOUR",
  4.5: "FOUR_HALF",
  5: "FIVE",
};

function getKeyFromValue(dictionary: any, value: string) {
  const foundKey = Object.keys(dictionary).find(
    (key) => dictionary[Number(key)] === value,
  );

  return foundKey ? Number(foundKey) : undefined;
}

export default function TestimonialView({ isAdmin }: TestimonialViewProps) {
  const {
    data: allTestimonials,
    isLoading,
    isError,
    refetch,
  } = api.testimonial.listAllTestimonials.useQuery();

  const createTestimonialMutation =
    api.testimonial.createNewTestimonial.useMutation();
  const presignedUrlMutation = api.s3.getPresignedUrl.useMutation();
  const deleteTestimonialMutation =
    api.testimonial.deleteTestimonial.useMutation();
  const deletePhotoMutation = api.s3.deletePhoto.useMutation();
  const configurePublihsedMutation =
    api.testimonial.configurePublished.useMutation();
  const updateTestimonialMutation = api.testimonial.updateTestimonial.useMutation();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [ratingNumber, setRatingNumber] = useState<RatingValue>(2.5);
  const [comment, setComment] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [selectedRatingNumber, setSelectedRatingNumber] =
    useState<RatingValue>(2.5);
  const [selectedComment, setSelectedComment] = useState<string>("");
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>("");
  const [wantToDelete, setWantToDelete] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);

  const [editorOpen, setEditorOpen] = useState<boolean>(true);

  const [deleteTestimonialConfirmation, setDeleteTestimonialConfirmation] =
    useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFile = async (file: File) => {
    try {
      const now = new Date();
      const isoString = now.toISOString();

      const uniqueFileName = `${isoString}${file.name}`;
      // Get the presigned URL for uploading
      const { presignedUrl, s3Url } = await presignedUrlMutation.mutateAsync({
        fileName: uniqueFileName,
        folderName: "testimonial_uploads",
        fileType: file.type,
        tags: "",
      });

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });

      return s3Url;
    } catch (err) {
      console.error("Something went wrong while uploading your file:", err);
      return "";
    }
  };

  const handleSubmitForm = async () => {
    try {
      setUploading(true);
      const rating = ratingValues[ratingNumber] as
        | "ONE"
        | "ONE_HALF"
        | "TWO"
        | "TWO_HALF"
        | "THREE"
        | "THREE_HALF"
        | "FOUR"
        | "FOUR_HALF"
        | "FIVE";

      let photoUrl = "";
      if (imageFile != null) {
        photoUrl = await uploadFile(imageFile);
      }

      const published = false;

      const newTestimonial = await createTestimonialMutation.mutateAsync({
        name,
        email,
        rating,
        comment,
        published,
        photoUrl,
      });
      setName("");
      setEmail("");
      setComment("");
      clearFile();
      setUploading(false);

      alert("Testimonial submitted successfully!");
    } catch (err) {
      console.error(
        "Something went wrong while submitting testimonial form:",
        err,
      );
      setUploading(false);
    }
  };

  const handleConfigurePublish = (id: string, published: boolean) => {
    return async () => {
      try {
        await configurePublihsedMutation.mutateAsync({
          id,
          published,
        });
        refetch();
      } catch (err) {
        console.error(
          "Something went wrong while trying to publish/unpublish the testimonial.",
        );
      }
    };
  };

  const handleDeleteTestimonial = (
    testimonialId: string,
    photoKey: string | null,
  ): React.MouseEventHandler<HTMLButtonElement> => {
    return (e) => {
      (async () => {
        try {
          if (photoKey != null && photoKey !== "") {
            await deletePhotoMutation.mutateAsync({
              key: photoKey.split("amazonaws.com/")[1] as string,
            });
          }
          await deleteTestimonialMutation.mutateAsync({ id: testimonialId });
          setDeleteTestimonialConfirmation(false);
          await refetch();
          alert("Testimonial deleted successfully.");
        } catch (err) {
          console.error("Something went wrong while deleting testimonial.");
        }
      })();
    };
  };
  

  const handleInitiateEdit = (
    id: string,
    name: string,
    email: string,
    rating:
      | "ONE"
      | "ONE_HALF"
      | "TWO"
      | "TWO_HALF"
      | "THREE"
      | "THREE_HALF"
      | "FOUR"
      | "FOUR_HALF"
      | "FIVE",
    comment: string,
    photoUrl: string | null,
  ): React.MouseEventHandler<HTMLButtonElement> => {
    return (e) => {
      (async () => {
        let newRating = getKeyFromValue(ratingValues, rating) as RatingValue;
  
        setWantToDelete(false);
  
        setSelectedId(id);
        setSelectedName(name);
        setSelectedEmail(email);
        setSelectedRatingNumber(newRating);
        setSelectedComment(comment);
        setSelectedPhotoUrl(photoUrl == null ? "" : photoUrl);
  
        setEditorOpen(true);
      })();
    };
  };
  
  const handleSaveEditChanges = async () => {
    try {
      
      if (selectedPhotoUrl != "" && wantToDelete) {
        await deletePhotoMutation.mutateAsync({
          key: selectedPhotoUrl.split("amazonaws.com/")[1] as string,
        });
      }

      let ratingValue = ratingValues[selectedRatingNumber]
      await updateTestimonialMutation.mutateAsync({
        id: selectedId,
        name: selectedName,
        email: selectedEmail,
        rating: ratingValue,
        comment: selectedComment,
        photoUrl: selectedPhotoUrl
      })
      setEditorOpen(false)
      refetch()
    } catch (err) {
      console.error("Something went wrong while editing the testimonial:", err)
      setEditorOpen(false)

    }
  };

  const clearFile = () => {
    // Clear the state
    setImageFile(null);

    // Reset the input field
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  return (
    <div className="mx-12 py-12">
      <h1 className="mb-4 font-bold">Testimonials</h1>
      {!isAdmin && (
        <div>
          <div className="wrap flex gap-1">
            {allTestimonials?.map((testimonial : any) => {
              return testimonial.published ? (
                <div
                  key={testimonial.id}
                  className="mb-5 flex w-fit flex-col gap-1 rounded-xl border-2 border-gray-200 p-4"
                >
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <div>
                    <span className="underline underline-offset-2">Email</span>
                    <span>: {testimonial.email}</span>
                  </div>
                  <div>
                    <span className="underline underline-offset-2">Rating</span>
                    <span>: {testimonial.rating}</span>
                  </div>
                  <div>
                    <span className="underline underline-offset-2">
                      Comment
                    </span>
                    <span>: {testimonial.comment}</span>
                  </div>

                  <div className="mb-4">
                    {testimonial.photoUrl && (
                      <div>
                        <img
                          src={testimonial.photoUrl}
                          alt={`Photo for testimonial ${testimonial.id} from ${testimonial.photoUrl}`}
                          className="mt-3 w-48 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div />
              );
            })}
          </div>

          <div className="w-fit rounded-2xl border-2 border-gray-200 p-6">
            <h2 className="mb-4 font-medium">Submit Testimonial</h2>
            <p>Name</p>
            <input
              className="mb-4 rounded-xl border-2 border-gray-200 px-3 py-1"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
            <p>Email</p>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              className="mb-4 rounded-xl border-2 border-gray-200 px-3 py-1"
              required
            />

            <p>Rating</p>
            <div className="flex gap-4">
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                onChange={(e) => {
                  setRatingNumber(Number(e.target.value) as RatingValue);
                }}
                required
              />
              <p>{ratingNumber}/5</p>
            </div>

            <p>Comment</p>
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              className="mb-4 h-32 w-80 rounded-xl border-2 border-gray-200 px-3 py-1 text-start"
              required
            />

            <p>Photo upload</p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="mb-4"
              onChange={(e) => {
                if (e.target.files != null && e.target.files.length != 0) {
                  setImageFile(e.target.files[0] as File);
                } else {
                  setImageFile(null);
                }
              }}
            />

            <div>
              {uploading && <p>Uploading...</p>}
              {!uploading && (
                <button
                  onClick={handleSubmitForm}
                  className="rounded-2xl bg-green-500 px-4 py-2 text-lg font-medium text-white duration-100 hover:bg-green-700 disabled:bg-green-200"
                  disabled={!name || !email || !ratingNumber || !comment}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="flex flex-wrap gap-3">
          {allTestimonials == undefined || allTestimonials.length == 0 ? (
            <p>No testimonials available</p>
          ) : null}
          {isError && <p>Something went wrong while fetching testimonials.</p>}
          {isLoading && <p>Loading testimonials...</p>}
          {allTestimonials
            ?.sort((a, b) => {
              return a.published === b.published ? 0 : a.published ? -1 : 1;
            })
            .map((testimonial) => {
              return (
                <div
                  key={testimonial.id}
                  className={`flex w-fit flex-col gap-1 rounded-xl border-2 border-gray-200 p-4 ${testimonial.published ? "bg-yellow-300" : ""}`}
                >
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <div>
                    <span className="underline underline-offset-2">Email</span>
                    <p>{testimonial.email}</p>
                  </div>
                  <div>
                    <span className="underline underline-offset-2">Rating</span>
                    <p>{testimonial.rating}</p>
                  </div>
                  <div>
                    <span className="underline underline-offset-2">
                      Comment
                    </span>
                    <p>{testimonial.comment}</p>
                  </div>

                  <div className="mb-4">
                    {testimonial.photoUrl && (
                      <div>
                        <img
                          src={testimonial.photoUrl}
                          alt={`Photo for testimonial ${testimonial.id} from ${testimonial.photoUrl}`}
                          className="mt-3 w-48 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex w-full justify-end gap-2">
                    {/* <button className="rounded-xl border-2 border-gray-500 bg-white px-4 py-1 text-gray-500 duration-200 hover:bg-gray-500 hover:text-white">
                    Edit
                  </button> */}
                    <button
                      onClick={handleInitiateEdit(
                        testimonial.id,
                        testimonial.name,
                        testimonial.email,
                        testimonial.rating,
                        testimonial.comment,
                        testimonial.photoUrl,
                      )}
                      className="rounded-xl border-2 border-gray-500 bg-white px-4 py-1 text-gray-500 duration-200 hover:bg-gray-500 hover:text-white"
                    >
                      Edit
                    </button>
                    {testimonial.published ? (
                      <button
                        onClick={handleConfigurePublish(testimonial.id, false)}
                        className="rounded-xl border-2 border-gray-500 bg-white px-4 py-1 text-gray-500 duration-200 hover:bg-gray-500 hover:text-white"
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        onClick={handleConfigurePublish(testimonial.id, true)}
                        className="rounded-xl border-2 border-gray-500 bg-white px-4 py-1 text-gray-500 duration-200 hover:bg-gray-500 hover:text-white"
                      >
                        Publish
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteTestimonialConfirmation(true)}
                      className="rounded-xl bg-red-500 px-4 py-1 text-white duration-200 hover:bg-red-700 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>

                  {deleteTestimonialConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="z-50 w-[350px] rounded-2xl bg-white p-6">
                        <div className="flex items-start justify-between">
                          <h1 className="mb-3 mt-2 text-2xl font-bold">
                            Confirmation
                          </h1>
                          <button
                            onClick={() =>
                              setDeleteTestimonialConfirmation(false)
                            }
                            className="rounded-full p-1 duration-200 hover:bg-gray-200"
                          >
                            <XIcon className="h-6 w-6 text-gray-500" />
                          </button>
                        </div>

                        <p className="mb-5">Are you sure?</p>
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-xl border-2 border-gray-500 px-4 py-1 text-gray-500 duration-200 hover:bg-gray-500 hover:text-white"
                            onClick={() =>
                              setDeleteTestimonialConfirmation(false)
                            }
                          >
                            Cancel
                          </button>
                          <button
                            className="rounded-xl bg-red-500 px-4 py-1 text-white hover:bg-red-700"
                            onClick={handleDeleteTestimonial(
                              testimonial.id,
                              testimonial.photoUrl,
                            )}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {editorOpen && (
                    <div className="fixed inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="z-50 min-w-[350px] rounded-2xl bg-white p-6">
                        <div className="flex items-start justify-between">
                          <h1 className="mb-3 mt-2 text-2xl font-bold">
                            Edit Testimonial
                          </h1>
                          <button
                            onClick={() => setEditorOpen(false)}
                            className="rounded-full p-1 duration-200 hover:bg-gray-200"
                          >
                            <XIcon className="h-6 w-6 text-gray-500" />
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex flex-col gap-2">
                            <div>
                              <p>Name</p>
                              <input
                                type="text"
                                className="border-2 border-gray-200"
                                value={selectedName}
                                onChange={(e) =>
                                  setSelectedName(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <p>Email</p>
                              <input
                                type="text"
                                className="border-2 border-gray-200"
                                value={selectedEmail}
                                onChange={(e) =>
                                  setSelectedEmail(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <p>Rating</p>
                              <div className="flex gap-2">
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  step="0.5"
                                  required
                                  value={selectedRatingNumber}
                                  onChange={(e) =>
                                    setSelectedRatingNumber(
                                      Number(e.target.value) as RatingValue,
                                    )
                                  }
                                />
                                <p>{selectedRatingNumber}</p>
                              </div>
                            </div>
                            <div>
                              <p>Comment</p>
                              <textarea
                                className="h-32 border-2 border-gray-200"
                                value={selectedComment}
                                onChange={(e) =>
                                  setSelectedComment(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          {selectedPhotoUrl != "" && !wantToDelete && <div className="relative">
                            <button className="absolute bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-700 font-medium end-1 top-1 duration-200" onClick={() => setWantToDelete(true)}>Delete Image</button>
                            <img src={selectedPhotoUrl} className="h-[300px] rounded-lg" />
                          </div>}
                          
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            onClick={() => setEditorOpen(false)}
                            className="rounded-lg bg-gray-500 px-4 py-1 font-medium text-white duration-200 hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button className="rounded-lg bg-green-500 px-4 py-1 font-medium text-white duration-200 hover:bg-green-700" onClick={handleSaveEditChanges}>
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
