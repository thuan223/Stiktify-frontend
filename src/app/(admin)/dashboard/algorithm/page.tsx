"use client";
import React, { useState } from "react";
import { Slider, Switch, Card } from "antd";

type AlgorithmConfig = {
  NumberOfCount: {
    wishLitCount: number;
    wishListScoreCount: number;
  };
  ResetScore: {
    discountScore: number;
    wasCheckScore: boolean;
  };
  NumberVideoSuggest: {
    triggerAction: number;
    collaboration: number;
    Trending: number;
    Random: number;
  };
  CollaberativeFiltering: {
    NumberCollaberator: number;
    NumberWishListVideo: number;
  };
  ScoreIncrease: {
    watchVideo: number;
    reactionAboutVideo: number;
    reactionAboutMusic: number;
    clickLinkMusic: number;
    followCreator: number;
    listenMusic: number;
    commentVideo: number;
    searchVideo: number;
    searchMusic: number;
    shareVideo: number;
  };
};

const ManageAlgorithm: React.FC = () => {
  const [config, setConfig] = useState<AlgorithmConfig>({
    NumberOfCount: { wishLitCount: 10, wishListScoreCount: 100 },
    ResetScore: { discountScore: 10, wasCheckScore: false },
    NumberVideoSuggest: {
      triggerAction: 4,
      collaboration: 4,
      Trending: 1,
      Random: 1,
    },
    CollaberativeFiltering: { NumberCollaberator: 5, NumberWishListVideo: 5 },
    ScoreIncrease: {
      watchVideo: 1,
      reactionAboutVideo: 1.5,
      reactionAboutMusic: 1.5,
      clickLinkMusic: 2.5,
      followCreator: 2.5,
      listenMusic: 2.5,
      commentVideo: 1.5,
      searchVideo: 2.5,
      searchMusic: 2.5,
      shareVideo: 2,
    },
  });

  const handleChange = (
    category: keyof AlgorithmConfig,
    key: string,
    value: any
  ) => {
    setConfig((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Manage Algorithm</h2>

      <div className="flex gap-4">
        {/* Number Of Count */}
        <Card
          title={<span className="text-xl">Number Of Count</span>}
          className="flex-1"
        >
          <div className="mb-4">
            <label className="block text-[18px] font-medium mb-1">
              Wish List Count:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">10</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.NumberOfCount.wishLitCount}
                min={10}
                max={30}
                step={1}
                onChange={(value) =>
                  handleChange("NumberOfCount", "wishLitCount", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">30</span>
            </div>
          </div>

          <div>
            <label className="block text-[18px] font-medium mb-1">
              Wish List Score Count:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-10 text-right">100</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.NumberOfCount.wishListScoreCount}
                min={100}
                max={500}
                step={10}
                onChange={(value) =>
                  handleChange("NumberOfCount", "wishListScoreCount", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-10">500</span>
            </div>
          </div>
        </Card>

        <Card
          title={<span className="text-xl">Wish List Averages</span>}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="mb-4 text-center">
            <label className="block text-[18px]  mb-2 text-gray-700">
              Wish List Average:
            </label>
            <span className="text-3xl  text-blue-600">1</span>
          </div>

          <div className="text-center">
            <label className="block text-[18px]  mb-2 text-gray-700">
              Score Count Average:
            </label>
            <span className="text-3xl  text-blue-600">2</span>
          </div>
        </Card>

        <Card
          title={<span className="text-xl">Reset Score</span>}
          className="flex-1"
        >
          <div className="mb-4">
            <label className="block text-[18px] font-medium mb-1">
              Discount Score:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-10 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                min={0}
                max={50}
                step={10}
                value={config.ResetScore.discountScore}
                onChange={(value) =>
                  handleChange("ResetScore", "discountScore", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-10">50</span>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-[18px] font-medium mb-1 mr-2">
              Was Check Score:
            </label>
            <Switch
              checked={config.ResetScore.wasCheckScore}
              onChange={(checked) =>
                handleChange("ResetScore", "wasCheckScore", checked)
              }
            />
          </div>
        </Card>
      </div>
      <div className="w-full flex ">
        <Card
          title={<span className="text-xl">Number Video Suggest</span>}
          className="mb-4 w-2/3"
        >
          <div className="flex flex-wrap">
            <div className="w-1/2 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Trigger Action:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.NumberVideoSuggest.triggerAction}
                  min={0}
                  max={10}
                  step={1}
                  onChange={(value) =>
                    handleChange("NumberVideoSuggest", "triggerAction", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">10</span>
              </div>
            </div>

            <div className="w-1/2 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Collaborator:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.NumberVideoSuggest.collaboration}
                  min={0}
                  max={10}
                  step={1}
                  onChange={(value) =>
                    handleChange("NumberVideoSuggest", "collaboration", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">10</span>
              </div>
            </div>

            <div className="w-1/2 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Trending:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.NumberVideoSuggest.Trending}
                  min={0}
                  max={2}
                  step={1}
                  onChange={(value) =>
                    handleChange("NumberVideoSuggest", "Trending", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>

            <div className="w-1/2 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Random:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.NumberVideoSuggest.Random}
                  min={0}
                  max={2}
                  step={1}
                  onChange={(value) =>
                    handleChange("NumberVideoSuggest", "Random", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>
          </div>
        </Card>
        <Card
          title={<span className="text-xl">Collaberative Filtering</span>}
          className=" w-1/3 mb-4"
        >
          <div className="p-2">
            <label className="block text-[18px] font-medium mb-1">
              Number Collaberator:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.CollaberativeFiltering.NumberCollaberator}
                min={0}
                max={10}
                step={1}
                onChange={(value) =>
                  handleChange(
                    "CollaberativeFiltering",
                    "NumberCollaberator",
                    value
                  )
                }
                className="flex-1"
              />
              <span className="text-sm w-6">10</span>
            </div>
          </div>

          <div className="p-2">
            <label className="block text-[18px] font-medium mb-1">
              Number WishList Video:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.CollaberativeFiltering.NumberWishListVideo}
                min={0}
                max={10}
                step={1}
                onChange={(value) =>
                  handleChange(
                    "CollaberativeFiltering",
                    "NumberWishListVideo",
                    value
                  )
                }
                className="flex-1"
              />
              <span className="text-sm w-6">10</span>
            </div>
          </div>
        </Card>
      </div>
      <Card
          title={<span className="text-xl">Score Increase</span>}
          className="mb-4 w-full"
        >
          <div className="flex flex-wrap">
            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Watch Video:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.watchVideo}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "watchVideo", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">10</span>
              </div>
            </div>

            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Reaction Video:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.reactionAboutVideo}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "reactionAboutVideo", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">10</span>
              </div>
            </div>

            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Reaction Music:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.reactionAboutMusic}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "reactionAboutMusic", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>

            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Click Link Music:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.clickLinkMusic}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "clickLinkMusic", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>
            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
               Follow Creator:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.followCreator}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "followCreator", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>
            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
               Listen Music:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.listenMusic}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "listenMusic", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>
            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
               Comment Video:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.commentVideo}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "commentVideo", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>
            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
               Search Video:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.searchVideo}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "searchVideo", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>
            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
               Search Music:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.searchMusic}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "searchMusic", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>
            <div className="w-1/3 p-2">
              <label className="block text-[18px] font-medium mb-1">
               Share Video:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.ScoreIncrease.shareVideo}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(value) =>
                    handleChange("ScoreIncrease", "shareVideo", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>
          </div>
        </Card>
    </div>
  );
};

export default ManageAlgorithm;
