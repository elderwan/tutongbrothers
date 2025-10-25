"use client"
import { useId, useState, useMemo, } from "react"
import { useErrorDialog } from "@/components/dialogs/error-dialog"
import { useSuccessDialog } from "@/components/dialogs/success-dialog"
import { registerApi } from "@/api/auth"
import { useAuthDialog } from "@/contexts/AuthDialogContext"
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"


import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SignupDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SignupDialog({ open, onOpenChange }: SignupDialogProps) {
  const id = useId()
  const { showError } = useErrorDialog()
  const { showSuccess } = useSuccessDialog()
  const { openSignIn, closeSignIn, openSignUp, closeSignUp } = useAuthDialog()

  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const dialogOpen = open !== undefined ? open : isOpen
  const handleOpenChange = onOpenChange || setIsOpen

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ]

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }
  const toggleVisibility = () => setIsVisible((prevState) => !prevState)
  const strength = checkStrength(password)

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length
  }, [strength])

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border"
    if (score <= 1) return "bg-red-500"
    if (score <= 2) return "bg-orange-500"
    if (score === 3) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password"
    if (score <= 2) return "Weak password"
    if (score === 3) return "Medium password"
    return "Strong password"
  }
  async function handleSubmitSignup() {
    if (!userEmail || !userName || !password) {
      showError({ code: 400, title: "Sign Up", msg: "please fill all fields" })
      return
    }
    if (!passwordRegex.test(password)) {
      showError({
        code: 400,
        title: "Invalid password",
        msg: "at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character"
      })
      return
    }
    try {
      setSubmitting(true)
      const res = await registerApi({ userEmail, userName, password })
      if (res.code === 200) {
        showSuccess({
          title: "Sign Up",
          msg: "Sign up success!",
          onConfirm: () => {
            // 关闭注册并打开登录
            handleOpenChange(false)
            closeSignUp()
            openSignIn()
          }
        })
      } else {
        showError({ code: res.code, title: "Sign Up Failed", msg: res.msg })
      }
    } catch (e) {
      showError({ code: 500, title: "Sign Up Failed", msg: "please try again later" })
    } finally {
      setSubmitting(false)
    }
  }

  const switchToSignin = () => {
    handleOpenChange(false)
    closeSignUp()
    openSignIn()
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh] rounded-lg" type="hover">
          <div className="p-6">
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-gray-300"
                aria-hidden="true"
              >
                <img
                  src="https://res.cloudinary.com/dewxaup4t/image/upload/v1761116328/mx96_vdrocj.jpg"
                  className="w-11 h-11 rounded-full object-cover"
                  alt="mx96"
                />
              </div>
              <DialogHeader>
                <DialogTitle className="sm:text-center">Create your account</DialogTitle>
                <DialogDescription className="sm:text-center">
                  Sign up to see more about tutong brothers!
                </DialogDescription>
              </DialogHeader>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmitSignup()
              }}
            >
              <div className="space-y-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-email`}>Email</Label>
                  <Input
                    id={`${id}-email`}
                    placeholder="example@google.com"
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-username`}>User Name</Label>
                  <Input
                    id={`${id}-username`}
                    placeholder="Your name"
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your account will be auto-generated and can be edited later in profile settings
                  </p>
                </div>
                {/* <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-password`}>Password</Label>
                  <Input
                    id={`${id}-password`}
                    placeholder="Enter your password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character
                  </p>
                </div> */}
                <div>
                  {/* Password input field with toggle visibility button */}
                  <div className="*:not-first:mt-2">
                    <Label htmlFor={id}>Password</Label>
                    <div className="relative">
                      <Input
                        id={id}
                        className="pe-9"
                        placeholder="Password"
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-describedby={`${id}-description`}
                      />
                      <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  <div
                    className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
                    role="progressbar"
                    aria-valuenow={strengthScore}
                    aria-valuemin={0}
                    aria-valuemax={4}
                    aria-label="Password strength"
                  >
                    <div
                      className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                      style={{ width: `${(strengthScore / 4) * 100}%` }}
                    ></div>
                  </div>

                  {/* Password strength description */}
                  <p
                    id={`${id}-description`}
                    className="text-foreground mb-2 text-sm font-medium"
                  >
                    {getStrengthText(strengthScore)}. Must contain:
                  </p>

                  {/* Password requirements list */}
                  <ul className="space-y-1.5" aria-label="Password requirements">
                    {strength.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckIcon
                            size={16}
                            className="text-emerald-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <XIcon
                            size={16}
                            className="text-muted-foreground/80"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                        >
                          {req.text}
                          <span className="sr-only">
                            {req.met ? " - Requirement met" : " - Requirement not met"}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Sign up"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account?</span>
              <Button variant="link" className="px-1" onClick={switchToSignin}>
                Sign in
              </Button>
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
