import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { Check, UploadSimple, Warning } from "@phosphor-icons/react";
import type { UpdateUserDto } from "@reactive-resume/dto";
import { updateUserSchema } from "@reactive-resume/dto";
import {
  Button,
  buttonVariants,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { UserAvatar } from "@/client/components/user-avatar";
import { useToast } from "@/client/hooks/use-toast";
import { useResendVerificationEmail } from "@/client/services/auth";
import { useUploadImage } from "@/client/services/storage";
import { useUpdateUser, useUser } from "@/client/services/user";

export const AccountSettings = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { updateUser, loading } = useUpdateUser();
  const { uploadImage, loading: isUploading } = useUploadImage();
  const { resendVerificationEmail } = useResendVerificationEmail();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      picture: "",
      name: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    user && onReset();
  }, [user]);

  const onReset = () => {
    if (!user) return;

    form.reset({
      picture: user.picture ?? "",
      name: user.name,
      username: user.username,
      email: user.email,
    });
  };

  const onSubmit = async (data: UpdateUserDto) => {
    if (!user) return;

    if (user.email !== data.email) {
      toast({
        variant: "info",
        title: t`Check your email for the confirmation link to update your email address.`,
      });
    }

    await updateUser({
      name: data.name,
      email: data.email,
      picture: data.picture,
      username: data.username,
    });

    form.reset(data);
  };

  const onSelectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const response = await uploadImage(file);
      const url = response.data;

      await updateUser({ picture: url });
    }
  };

  const onResendVerificationEmail = async () => {
    const data = await resendVerificationEmail();
    toast({ variant: "success", title: data.message });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold leading-relaxed tracking-tight">{t`Account`}</h3>
        <p className="leading-relaxed opacity-75">
          {t`Here, you can update your account information such as your profile picture, name and username.`}
        </p>
      </div>

      <Form {...form}>
        <form className="grid gap-6 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="picture"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <div className={cn("flex items-end gap-x-4 sm:col-span-2", error && "items-center")}>
                <UserAvatar />

                <FormItem className="flex-1">
                  <FormLabel htmlFor="picture-input">{t`Picture`}</FormLabel>
                  <FormControl>
                    <Input
                      id="picture-input"
                      placeholder="https://..."
                      {...field}
                      value={field.value ?? ""}
                      aria-describedby="picture-description"
                    />
                  </FormControl>
                  <FormDescription id="picture-description">
                    {t`Enter a URL or upload an image.`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>

                {!user.picture && (
                  <>
                    <input
                      ref={inputRef}
                      hidden
                      type="file"
                      id="upload-image"
                      aria-label={t`Upload an image file`}
                      onChange={onSelectImage}
                    />
                    <motion.button
                      type="button"
                      disabled={isUploading}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
                      aria-label={t`Upload an image`}
                      onClick={() => inputRef.current?.click()}
                    >
                      <UploadSimple aria-hidden="true" />
                    </motion.button>
                  </>
                )}
              </div>
            )}
          />

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name-input">{t`Name`}</FormLabel>
                <FormControl>
                  <Input
                    id="name-input"
                    autoComplete="name"
                    {...field}
                    aria-describedby="name-description"
                  />
                </FormControl>
                <FormDescription id="name-description">{t`Votre nom complet.`}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username-input">{t`Username`}</FormLabel>
                <FormControl>
                  <Input
                    id="username-input"
                    autoComplete="username"
                    className="lowercase"
                    {...field}
                    aria-describedby="username-description"
                  />
                </FormControl>
                <FormDescription id="username-description">{t`Choisissez un nom d'utilisateur unique.`}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email-input">{t`Email`}</FormLabel>
                <FormControl>
                  <Input
                    id="email-input"
                    type="email"
                    autoComplete="email"
                    className="lowercase"
                    {...field}
                    aria-describedby="email-status"
                  />
                </FormControl>
                <FormDescription
                  id="email-status"
                  className={cn(
                    "flex items-center gap-x-1.5 font-medium opacity-100",
                    user.emailVerified ? "text-success-accent" : "text-warning-accent",
                  )}
                >
                  {user.emailVerified ? <Check size={12} /> : <Warning size={12} />}
                  {user.emailVerified ? t`Verified` : t`Unverified`}
                  {!user.emailVerified && (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto text-xs"
                      onClick={onResendVerificationEmail}
                    >
                      {t`Resend email confirmation link`}
                    </Button>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <AnimatePresence presenceAffectsLayout>
            {form.formState.isDirty && (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center space-x-2 self-center sm:col-start-2"
              >
                <Button type="submit" disabled={loading}>
                  {t`Save Changes`}
                </Button>
                <Button type="reset" variant="ghost" onClick={onReset}>
                  {t`Discard`}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </div>
  );
};
