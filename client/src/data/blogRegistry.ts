import { registerPost } from "@/lib/blog";
import blogPosts from "./blog-posts.json";

blogPosts.forEach((post) => registerPost(post));
