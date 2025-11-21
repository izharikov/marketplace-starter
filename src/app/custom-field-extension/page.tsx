"use client";

import { useCallback, useEffect, useState } from "react";
import { useMarketplaceClient } from "@/components/providers/Marketplace";
import { ClientSDK } from "@sitecore-marketplace-sdk/client";
import { ColorPicker, ColorPickerAlpha, ColorPickerEyeDropper, ColorPickerFormat, ColorPickerHue, ColorPickerOutput, ColorPickerSelection } from "@/components/ui/shadcn-io/color-picker";
import Color, { ColorInstance, ColorLike } from "color";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function CustomFieldExtension() {
  const client = useMarketplaceClient();
  const [initialized, setInitialized] = useState(false);
  const [fieldValue, setFieldValue] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<ColorInstance>();
  const [status, setStatus] = useState<"saving" | "error">();

  useEffect(() => {
    async function init(client: ClientSDK) {
      const value = await client.getValue();
      try {
        const color = Color(value);
        setSelectedColor(color);
        setFieldValue(color.hex());
        setInitialized(true);
      } catch (error) {
        console.log('error initializing color:', error);
        setInitialized(true);
      }
    }
    if (client) {
      init(client);
    }
  }, [client, setFieldValue, setSelectedColor]);

  const handleClick = () => {
    if (!selectedColor) {
      return;
    }
    setFieldValue(selectedColor.hex());
    setStatus("saving");
    client &&
      client.setValue(selectedColor.hex())
        .then(() => client.closeApp());
  };

  const onChange = useCallback((color: ColorLike) => {
    setSelectedColor(new Color(color));
  }, [setSelectedColor]);

  return <div className="w-full h-full flex justify-center my-auto">
    {initialized && (
      <ColorPicker className="max-w-sm rounded-md border bg-background p-4 shadow-sm"
        defaultValue={fieldValue}
        onChange={onChange}
      >
        <ColorPickerSelection className="h-56" />
        <div className="flex items-center gap-4">
          <ColorPickerEyeDropper />
          <div className="grid w-full gap-1">
            <ColorPickerHue />
            <ColorPickerAlpha />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerOutput />
          <ColorPickerFormat />
        </div>
        <div className="flex">
          <Button onClick={handleClick} disabled={selectedColor == null || status === "saving"} >
            {status === "saving" && <Spinner className="size-4 text-white" />}
            Set Color
          </Button>
        </div>
      </ColorPicker>)}
    {!initialized && (
      <Spinner className="size-28 text-primary" />
    )}
  </div>
}

export default CustomFieldExtension;
