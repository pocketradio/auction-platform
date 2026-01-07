"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
	name: z.string().min(2).max(50),
	email: z.string().email(),
	password: z.string()
		.min(8, { message: "Password must be at least 8 characters long." })
		.regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
		.regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
		.regex(/[0-9]/, { message: "Must contain at least one number." })
		.regex(/[!@#$%^&*]/, { message: "Must contain at least one special character." }),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match.",
	path: ["confirmPassword"],
})

export function SignupForm() {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await fetch("http://localhost:5000/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				name: values.name,
				email: values.email,
				password: values.password,
			}),
		})
			.then(async () => {
				await fetch("http://localhost:5000/me", {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					},
					credentials: "include", // browser attaches cookie 
				})
					.then((response) => {
						if (!response.ok) {
							router.push("/login");
							return;
						}
						router.push("/dashboard");
					})
			})

		console.log(values);
	}

	return (

		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="shadcn" {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" {...field} />
							</FormControl>
							<FormDescription>
								This is your email address.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormDescription>
								Create a strong password.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormDescription>
								Re-enter your password.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Sign Up</Button>
			</form>
		</Form>
	)
}