'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function CategoryFilter() {
	const [categories] = useState<{ _id: string; name: string }[]>([
		{ _id: "1", name: "Conference" },
		{ _id: "2", name: "Workshop" },
		{ _id: "3", name: "Webinar" },
		{ _id: "4", name: "Meetup" },
	]); // Placeholder categories
	const router = useRouter();
	const searchParams = useSearchParams();

	const onSelectCategory = (category: string) => {
		let newUrl = '';

		if (category && category !== 'All') {
			newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: 'category',
				value: category,
			});
		} else {
			newUrl = removeKeysFromQuery({
				params: searchParams.toString(),
				keysToRemove: ['category'],
			});
		}

		router.push(newUrl, { scroll: false });
	};

	return (
		<Select onValueChange={(value: string) => onSelectCategory(value)}>
			<SelectTrigger className="select-field">
				<SelectValue placeholder="Category" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="All" className="select-item p-regular-14">
					All
				</SelectItem>
				{categories.map((category) => (
					<SelectItem
						value={category.name}
						key={category._id}
						className="select-item p-regular-14"
					>
						{category.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
} 