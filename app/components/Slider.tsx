import { FC, ReactNode } from "react";
import * as React from "react";
import Slider from "@mui/base/Slider";

interface Props {
  min: number;
  max: number;
  defaultValue: [number, number];
  label: string;
  marks: "years" | boolean;
  children?: ReactNode;
}

interface ValueProps {
  children?: ReactNode;
}

const Component: FC<Props> = ({ defaultValue, min, max, label, marks }) => {
  const Marks = () => {
    if (marks == "years") {
      return [
        { value: 1985 },
        { value: 1990 },
        { value: 1995 },
        { value: 2000 },
        { value: 2005 },
        { value: 2010 },
        { value: 2015 },
        { value: 2020 },
      ];
    }
    if (marks) return true;
  };

  const SliderValueLabel: FC<ValueProps> = ({ children }) => {
    return (
      <span className="label absolute bottom-3.5">
        <output className="value">{children}</output>
      </span>
    );
  };

  return (
    <div className="w-72">
      <div className="pb-7">
        <label className=" text-secondary">{label}</label>
      </div>

      <Slider
        defaultValue={defaultValue}
        min={min}
        max={max}
        disableSwap
        marks={Marks()}
        slots={{ valueLabel: SliderValueLabel }}
        slotProps={{
          root: ({ disabled }) => ({
            className: `h-1.5 w-full py-4 inline-block relative touch-none ${
              disabled
                ? "opacity-50 cursor-default pointer-events-none text-white dark:text-slate-600"
                : "hover:opacity-100 cursor-pointer text-white"
            }`,
          }),
          rail: {
            className:
              "block absolute w-full h-1 rounded-sm bg-stone-900 opacity-40",
          },
          thumb: {
            className:
              "ring-stone-400 ring-2 w-4 h-4 -mt-1 -ml-2 flex items-center justify-center bg-white rounded-full shadow absolute",
          },
          track: {
            className: "bg-white block absolute h-1 rounded-sm",
          },
          mark: {
            className: "absolute w-0.5 h-1 bg-neutral-600",
          },
        }}
      />
    </div>
  );
};

export default Component;
