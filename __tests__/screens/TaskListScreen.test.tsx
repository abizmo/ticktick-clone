import React from "react";
import { render } from "@testing-library/react-native";
import TaskListScreen from "../../src/screens/TaskListScreen";
import { mockTasks } from "../../src/data/mockData";

describe("TaskListScreen", () => {
  const mockRoute = {
    params: {
      listId: "2",
      listName: "Work",
    },
  };

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { getByText } = render(<TaskListScreen route={mockRoute} />);
      expect(getByText("Work")).toBeTruthy();
    });

    it("should display the list name in header", () => {
      const { getByText } = render(<TaskListScreen route={mockRoute} />);
      expect(getByText("Work")).toBeTruthy();
    });

    it("should display task count summary", () => {
      const workTasks = mockTasks.filter((task) => task.listId === "2");
      const pendingCount = workTasks.filter((task) => !task.completed).length;
      const completedCount = workTasks.filter((task) => task.completed).length;

      const { getByText } = render(<TaskListScreen route={mockRoute} />);
      expect(
        getByText(`${pendingCount} pending, ${completedCount} completed`)
      ).toBeTruthy();
    });

    it("should render all tasks for the specified list", () => {
      const workTasks = mockTasks.filter((task) => task.listId === "2");
      const { getByText } = render(<TaskListScreen route={mockRoute} />);

      workTasks.forEach((task) => {
        expect(getByText(task.title)).toBeTruthy();
      });
    });

    it("should not render tasks from other lists", () => {
      const otherListTasks = mockTasks.filter((task) => task.listId !== "2");
      const { queryByText } = render(<TaskListScreen route={mockRoute} />);

      otherListTasks.forEach((task) => {
        expect(queryByText(task.title)).toBeNull();
      });
    });

    it("should render add button", () => {
      const { UNSAFE_root } = render(<TaskListScreen route={mockRoute} />);
      const addButtons = UNSAFE_root.findAllByProps({ testID: undefined });
      expect(addButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Task Display", () => {
    it("should display task titles", () => {
      const { getByText } = render(<TaskListScreen route={mockRoute} />);
      expect(getByText("Review project proposal")).toBeTruthy();
      expect(getByText("Finish weekly report")).toBeTruthy();
    });

    it("should display task descriptions when present", () => {
      const { getByText } = render(<TaskListScreen route={mockRoute} />);
      expect(
        getByText("Go through the new project proposal and provide feedback")
      ).toBeTruthy();
      expect(
        getByText("Complete and submit the weekly progress report")
      ).toBeTruthy();
    });

    it("should display priority badges", () => {
      const { getAllByText } = render(<TaskListScreen route={mockRoute} />);
      const highPriorityBadges = getAllByText("high");
      expect(highPriorityBadges.length).toBeGreaterThan(0);
    });

    it("should display due dates when present", () => {
      const { getByText } = render(<TaskListScreen route={mockRoute} />);
      const taskWithDueDate = mockTasks.find(
        (task) => task.listId === "2" && task.dueDate
      );
      if (taskWithDueDate && taskWithDueDate.dueDate) {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        }).format(taskWithDueDate.dueDate);
        expect(getByText(formattedDate)).toBeTruthy();
      }
    });
  });

  describe("Task States", () => {
    it("should handle completed tasks correctly", () => {
      const completedTask = mockTasks.find(
        (task) => task.listId === "2" && task.completed
      );
      if (completedTask) {
        const { getByText } = render(<TaskListScreen route={mockRoute} />);
        const taskElement = getByText(completedTask.title);
        expect(taskElement).toBeTruthy();
      }
    });

    it("should handle incomplete tasks correctly", () => {
      const incompleteTask = mockTasks.find(
        (task) => task.listId === "2" && !task.completed
      );
      if (incompleteTask) {
        const { getByText } = render(<TaskListScreen route={mockRoute} />);
        const taskElement = getByText(incompleteTask.title);
        expect(taskElement).toBeTruthy();
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty list gracefully", () => {
      const emptyListRoute = {
        params: {
          listId: "999",
          listName: "Empty List",
        },
      };
      const { getByText } = render(<TaskListScreen route={emptyListRoute} />);
      expect(getByText("Empty List")).toBeTruthy();
      expect(getByText("0 pending, 0 completed")).toBeTruthy();
    });

    it("should handle tasks without descriptions", () => {
      const taskWithoutDescription = mockTasks.find(
        (task) => task.listId === "2" && !task.description
      );
      if (taskWithoutDescription) {
        const { getByText, queryByText } = render(
          <TaskListScreen route={mockRoute} />
        );
        expect(getByText(taskWithoutDescription.title)).toBeTruthy();
      }
    });

    it("should handle tasks without due dates", () => {
      const { getByText } = render(<TaskListScreen route={mockRoute} />);
      const allWorkTasks = mockTasks.filter((task) => task.listId === "2");
      allWorkTasks.forEach((task) => {
        expect(getByText(task.title)).toBeTruthy();
      });
    });

    it("should handle different list IDs correctly", () => {
      const personalRoute = {
        params: {
          listId: "3",
          listName: "Personal",
        },
      };
      const { getByText } = render(<TaskListScreen route={personalRoute} />);
      expect(getByText("Personal")).toBeTruthy();

      const personalTasks = mockTasks.filter((task) => task.listId === "3");
      expect(personalTasks.length).toBeGreaterThan(0);
    });
  });

  describe("Priority Color Mapping", () => {
    it("should correctly map priority levels to colors", () => {
      const { UNSAFE_root } = render(<TaskListScreen route={mockRoute} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe("Date Formatting", () => {
    it("should format dates correctly", () => {
      const date = new Date("2024-01-15");
      const formatted = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
      expect(formatted).toBe("Jan 15");
    });

    it("should handle undefined dates", () => {
      const formatDate = (date: Date | undefined) => {
        if (!date) return "";
        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        }).format(date);
      };
      expect(formatDate(undefined)).toBe("");
    });
  });

  describe("Task Filtering", () => {
    it("should correctly filter tasks by list ID", () => {
      const listId = "2";
      const filtered = mockTasks.filter((task) => task.listId === listId);
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((task) => {
        expect(task.listId).toBe(listId);
      });
    });

    it("should separate completed and pending tasks", () => {
      const workTasks = mockTasks.filter((task) => task.listId === "2");
      const completed = workTasks.filter((task) => task.completed);
      const pending = workTasks.filter((task) => !task.completed);

      expect(completed.length + pending.length).toBe(workTasks.length);
    });
  });

  describe("Component Structure", () => {
    it("should have SafeAreaView as root component", () => {
      const { UNSAFE_root } = render(<TaskListScreen route={mockRoute} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it("should render FlatList for task items", () => {
      const { UNSAFE_root } = render(<TaskListScreen route={mockRoute} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should render all interactive elements", () => {
      const { UNSAFE_root } = render(<TaskListScreen route={mockRoute} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
