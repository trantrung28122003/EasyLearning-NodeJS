import { Field } from "formik";
import React from "react";

function login123() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-12 bg-default-background px-12 py-12 mobile:flex-col mobile:flex-wrap mobile:gap-12 mobile:px-6 mobile:py-12">
      <div className="flex max-w-[576px] grow shrink-0 basis-0 flex-col items-center justify-center gap-12 self-stretch mobile:h-auto mobile:w-full mobile:max-w-[576px] mobile:flex-none">
        <img
          className="h-8 flex-none object-cover"
          src="https://res.cloudinary.com/subframe/image/upload/v1711417518/shared/fdb8rlpzh1gds6vzsnt0.svg"
        />
        <div className="flex flex-col items-center justify-center gap-6 px-12 mobile:flex mobile:px-0 mobile:py-0">
          <div className="flex w-full items-start justify-center gap-4 px-2 py-2">
            <div className="flex flex-col items-start gap-1">
              <span className="w-full text-heading-3 font-heading-3 text-brand-700">
                Spark your imagination
              </span>
              <span className="w-full text-body font-body text-subtext-color">
                Dive into a world where your creative ideas are instantly
                brought to life. Let’s paint your thoughts in digital strokes.
              </span>
            </div>
          </div>
          <div className="flex items-start justify-center gap-4 px-2 py-2">
            <div className="flex flex-col items-start gap-1">
              <span className="text-heading-3 font-heading-3 text-brand-700">
                Simplify the complex
              </span>
              <span className="text-body font-body text-subtext-color">
                Say goodbye to mundane tasks. Our AI streamlines your workflow,
                freeing you to focus on what truly matters.
              </span>
            </div>
          </div>
          <div className="flex items-start justify-center gap-4 px-2 py-2">
            <div className="flex flex-col items-start gap-1">
              <span className="text-heading-3 font-heading-3 text-brand-700">
                Boost your brainpower
              </span>
              <span className="text-body font-body text-subtext-color">
                Elevate your learning with tailored insights and resources.
                It&#39;s like having a personal coach in your pocket.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex max-w-[448px] grow shrink-0 basis-0 flex-col items-center justify-center gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-12 py-12 shadow-lg">
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <span className="w-full text-heading-3 font-heading-3 text-default-font">
            Create your account
          </span>
          <div className="flex w-full flex-col items-start justify-center gap-6">
            <Field className="h-auto w-full flex-none" label="Name" helpText="">
              <Field
                placeholder=""
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </Field>
            <Field
              className="h-auto w-full flex-none"
              label="Email"
              helpText=""
            >
              <Field
                placeholder=""
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </Field>
            <Field
              className="h-auto w-full flex-none"
              label="Password"
              helpText=""
            >
              <Field
                type="password"
                placeholder=""
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </Field>
          </div>
          <button
            className="h-10 w-full flex-none"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          >
            Create account
          </button>
          <div className="flex flex-wrap items-start gap-1">
            <span className="text-body font-body text-default-font">
              Have an account?
            </span>
            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default login123;
