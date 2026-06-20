export type NoteSection = {
  heading: string
  points: string[]
}

export type Unit = {
  id: string
  number: number
  title: string
  summary: string
  sections: NoteSection[]
}

export const units: Unit[] = [
  {
    id: "unit-1",
    number: 1,
    title: "Introduction to Operating Systems",
    summary:
      "What an OS is, its goals, key concepts, types, structures, services, and system calls.",
    sections: [
      {
        heading: "Definition & Views",
        points: [
          "An OS is system software that manages hardware and provides services for application programs, acting as an intermediary between users and hardware.",
          "User view: ease of use (PC) vs resource maximization (mainframe/server).",
          "System view: OS is a resource allocator and a control program.",
          "Formally: OS = kernel + system programs.",
        ],
      },
      {
        heading: "Goals / Objectives",
        points: [
          "Convenience: make the computer easier to use.",
          "Efficiency / performance: use hardware resources effectively.",
          "Resource allocation: manage CPU time, memory, storage, I/O devices.",
          "Protection & security: safe resource access, controlled execution, data integrity.",
        ],
      },
      {
        heading: "Key Concepts",
        points: [
          "Process: a program in execution (code, program counter, stack, data, heap).",
          "Thread: the smallest unit of CPU execution within a process.",
          "Kernel: core part of the OS that runs at all times (memory, process, device control).",
          "System call: the interface between user programs and the OS (fork, read, write, exec).",
          "Interrupt: a signal to the CPU that an event needs immediate attention (hardware or software).",
        ],
      },
      {
        heading: "Types of Operating Systems",
        points: [
          "Batch OS: jobs processed in batches, no user interaction (early mainframes).",
          "Time-sharing OS: multiple users share via small time slices/quanta (UNIX, Linux).",
          "Real-time OS (RTOS): deterministic response time; hard vs soft real-time.",
          "Distributed OS: manages multiple computers, appears as a single system (cloud, clusters).",
        ],
      },
      {
        heading: "OS Structures / Architectures",
        points: [
          "Simple structure (MS-DOS): no clear separation, unsafe.",
          "Layered approach (THE, MULTICS): layers use only lower layers; easy to build but less efficient.",
          "Microkernel (Mach, QNX): minimal kernel, services in user space; reliable but message-passing overhead.",
          "Modular kernel (modern Linux, Solaris): core kernel + dynamically loadable kernel modules.",
        ],
      },
      {
        heading: "Computer System Architecture",
        points: [
          "Single-processor systems: one main general-purpose CPU.",
          "Multiprocessor (parallel/tightly coupled): increased throughput, economy of scale, increased reliability (graceful degradation, fault tolerance).",
          "AMP (Asymmetric): boss-worker; SMP (Symmetric): all processors are peers running identical OS copy.",
          "Multicore (chip multiprocessing): multiple cores on one chip; faster on-chip communication.",
        ],
      },
      {
        heading: "OS Services & System Calls",
        points: [
          "Services: program execution, I/O operations, file-system manipulation, communication, error detection, resource allocation, accounting, protection & security.",
          "System call categories: process control, file management, device management, information maintenance, communications.",
          "A trap/syscall instruction switches CPU from user mode to kernel mode.",
          "Mechanism vs Policy: Policy = what to do; Mechanism = how to do it. Keep mechanisms general and flexible.",
        ],
      },
    ],
  },
  {
    id: "unit-2",
    number: 2,
    title: "Process Management",
    summary:
      "Processes, process states, the PCB, schedulers, context switching, and threads.",
    sections: [
      {
        heading: "Process Basics",
        points: [
          "A process is a program in execution, including text (code), program counter, registers, stack, heap, and data section.",
          "Memory layout: Stack (temporary data), Heap (dynamic memory), Data, Text.",
        ],
      },
      {
        heading: "Five-State Model",
        points: [
          "New: process is being created.",
          "Ready: in memory, has everything except the CPU, waiting to run.",
          "Running: instructions executing on the CPU (one per core at a time).",
          "Waiting (Blocked): waiting for an event such as I/O completion.",
          "Terminated: finished execution.",
        ],
      },
      {
        heading: "Process Control Block (PCB)",
        points: [
          "Kernel data structure holding all info about a process (also called task control block).",
          "Contents: PID, process state, program counter, CPU registers, scheduling info, memory info, accounting info, I/O status.",
          "Used during context switching to save/restore process state. Most important data structure in the OS.",
        ],
      },
      {
        heading: "Schedulers",
        points: [
          "Long-term (job) scheduler: selects processes into ready queue; controls degree of multiprogramming; runs infrequently.",
          "Short-term (CPU) scheduler: selects which ready process runs next; runs very frequently (ms), must be fast.",
          "Medium-term scheduler: swaps processes in/out of memory.",
          "Queues: job queue, ready queue, device queues.",
        ],
      },
      {
        heading: "Context Switching",
        points: [
          "Switching the CPU from one process to another by saving state to PCB and loading the next.",
          "Pure overhead — does no useful work; frequent switching reduces performance.",
        ],
      },
      {
        heading: "Threads",
        points: [
          "A thread is the smallest unit of CPU execution; a lightweight process.",
          "Threads share code, data, and OS resources; each has its own program counter, stack, and registers.",
          "Benefits: responsiveness, resource sharing, economy, scalability.",
          "User-Level Threads (ULT): fast, but one block blocks all. Kernel-Level Threads (KLT): true parallelism, more overhead.",
          "Models: Many-to-One, One-to-One, Many-to-Many.",
        ],
      },
    ],
  },
  {
    id: "unit-3",
    number: 3,
    title: "CPU Scheduling",
    summary:
      "Scheduling criteria, preemptive vs non-preemptive, and the classic algorithms.",
    sections: [
      {
        heading: "Scheduling Criteria",
        points: [
          "CPU Utilization: % of time CPU is busy (maximize).",
          "Throughput: processes completed per time unit (maximize).",
          "Turnaround Time = Completion Time − Arrival Time (minimize).",
          "Waiting Time = Turnaround Time − Burst Time (minimize).",
          "Response Time = First Start Time − Arrival Time (minimize; critical for interactive systems).",
        ],
      },
      {
        heading: "Preemptive vs Non-Preemptive",
        points: [
          "Non-preemptive: a process holds the CPU until it terminates or blocks; simple, lower overhead, convoy effect.",
          "Preemptive: OS can interrupt a running process; needs timer interrupt; better responsiveness, higher overhead.",
        ],
      },
      {
        heading: "Algorithms",
        points: [
          "FCFS: first come, first served (FIFO). Simple but suffers convoy effect.",
          "SJF (Shortest Job First): smallest next burst first; optimal average waiting time but burst time hard to predict; starvation possible.",
          "SRTF: preemptive SJF; preempt if a new process has a shorter remaining time; more context switches.",
          "Priority Scheduling: highest priority first; starvation solved by aging.",
          "Round Robin (RR): each process gets a time quantum; preemptive; fair, no starvation; performance depends on quantum size.",
          "Multilevel Queue: ready queue partitioned into separate queues (e.g. foreground RR, background FCFS).",
        ],
      },
      {
        heading: "Inter-Process Communication (IPC)",
        points: [
          "Lets processes exchange data, synchronize, and share resources.",
          "Shared memory: fast, shared address space, needs careful synchronization.",
          "Message passing: managed by kernel, good for smaller data; direct or indirect (mailboxes).",
          "Techniques: pipes, sockets, signals, message queues.",
        ],
      },
    ],
  },
  {
    id: "unit-4",
    number: 4,
    title: "Synchronization & Deadlocks",
    summary:
      "Critical section problem, synchronization mechanisms, classic problems, and deadlocks.",
    sections: [
      {
        heading: "Critical Section Problem",
        points: [
          "A critical section is code that accesses shared resources; only one process should execute it at a time.",
          "A correct solution needs: Mutual Exclusion, Progress, and Bounded Waiting.",
        ],
      },
      {
        heading: "Synchronization Mechanisms",
        points: [
          "Mutex lock: only one thread in the critical section; lock()/unlock(); can cause busy waiting (spinlocks).",
          "Semaphore: integer with atomic wait(P)/signal(V). Binary (like a mutex) or counting (multiple resources). No busy waiting (blocks).",
          "Monitor: high-level construct combining shared data, methods, and condition variables (wait/signal).",
        ],
      },
      {
        heading: "Classical Problems",
        points: [
          "Producer–Consumer: uses semaphores full, empty, mutex to avoid overfilling/empty buffer.",
          "Readers–Writers: many readers concurrently, writers need exclusive access.",
          "Dining Philosophers: illustrates deadlock and starvation; solved by ordering resources or limiting diners.",
        ],
      },
      {
        heading: "Deadlocks — Coffman's Conditions",
        points: [
          "Mutual Exclusion: resources cannot be shared.",
          "Hold and Wait: a process holds resources while requesting more.",
          "No Preemption: resources can't be forcibly taken.",
          "Circular Wait: a circular chain of waiting processes exists.",
        ],
      },
      {
        heading: "Handling Deadlocks",
        points: [
          "Prevention: ensure at least one Coffman condition never holds.",
          "Avoidance: Banker's Algorithm grants a request only if the system stays in a safe state (Need = Max − Allocation).",
          "Detection & Recovery: periodically detect cycles; recover via process termination or resource preemption.",
        ],
      },
    ],
  },
  {
    id: "unit-5",
    number: 5,
    title: "Memory Management",
    summary:
      "Allocation methods, paging, segmentation, virtual memory, demand paging, and page replacement.",
    sections: [
      {
        heading: "Requirements",
        points: [
          "Tracking, allocation, deallocation, and relocation (dynamic relocation with base/limit registers).",
          "Protection: processes must not access each other's memory.",
          "Sharing, logical organization, physical organization, and efficiency.",
        ],
      },
      {
        heading: "Contiguous Allocation",
        points: [
          "Fixed partitioning: fixed-size partitions; simple but causes internal fragmentation.",
          "Dynamic partitioning: partitions sized to needs; causes external fragmentation.",
          "Placement: First Fit, Best Fit, Worst Fit.",
          "Compaction rearranges memory to reduce external fragmentation.",
        ],
      },
      {
        heading: "Paging",
        points: [
          "Divides logical memory into pages and physical memory into equal-sized frames.",
          "Page table maps pages to frames; logical address = page number (p) + offset (d).",
          "TLB (Translation Lookaside Buffer): fast cache of recent page-to-frame mappings.",
          "MMU translates virtual addresses to physical addresses.",
          "No external fragmentation, but possible internal fragmentation (last frame).",
        ],
      },
      {
        heading: "Segmentation",
        points: [
          "Divides a process into variable-sized logical modules (functions, arrays, stacks).",
          "Segment table stores base address and limit per segment.",
          "Supports modular programming, sharing, and protection; suffers external fragmentation.",
        ],
      },
      {
        heading: "Virtual Memory & Demand Paging",
        points: [
          "Virtual memory runs processes larger than physical memory by keeping parts on disk.",
          "Demand paging loads pages only when needed. A page fault occurs when a referenced page is not in memory.",
          "EAT = (1 − p) × Memory Access Time + p × Page Fault Time, where p = page fault rate.",
          "Thrashing: excessive page faulting where the system spends more time swapping than executing.",
        ],
      },
      {
        heading: "Page Replacement Algorithms",
        points: [
          "FIFO: replace oldest page; can suffer Belady's anomaly (more frames → more faults).",
          "LRU: replace the least recently used page; uses temporal locality; needs usage tracking.",
          "Optimal (OPT): replace the page not used for the longest time in the future; not implementable, used for benchmarking.",
        ],
      },
    ],
  },
  {
    id: "unit-6",
    number: 6,
    title: "Storage & File Management",
    summary:
      "Storage hierarchy, disk structure, disk scheduling, files, directories, allocation, and protection.",
    sections: [
      {
        heading: "Storage Hierarchy",
        points: [
          "Registers → Cache → Main Memory (volatile) → Secondary Storage (HDD/SSD) → Tertiary (tape, optical).",
          "Volatile storage loses contents on power off; non-volatile persists.",
          "RAID improves reliability via redundancy (e.g. mirroring); levels 0–6 trade cost/performance/reliability.",
        ],
      },
      {
        heading: "Disk Structure & Scheduling",
        points: [
          "A magnetic disk has platters, tracks, sectors, and cylinders. Sector ~512B or 4KB.",
          "Access time = seek time + rotational latency.",
          "Disk scheduling: FCFS, SSTF (shortest seek, may starve), SCAN (elevator), C-SCAN, LOOK, C-LOOK.",
        ],
      },
      {
        heading: "Files & Directories",
        points: [
          "A file is a named collection of related information on secondary storage.",
          "Attributes: name, identifier, type, size, location, protection, timestamps, user IDs.",
          "Operations: create, open, read, write, seek, close, delete, truncate.",
          "Directory structures: single-level, two-level, tree-structured, acyclic graph, general graph.",
          "File systems: NTFS, FAT32, exFAT, ext4, APFS.",
        ],
      },
      {
        heading: "Allocation & Free-Space",
        points: [
          "Contiguous: consecutive blocks; fast access; external fragmentation.",
          "Linked: blocks linked with pointers; no fragmentation; slow random access.",
          "Indexed: index block holds addresses; supports direct access; index overhead.",
          "Free-space management: bit vector, linked list, grouping, counting.",
        ],
      },
      {
        heading: "Protection",
        points: [
          "Access types: read, write, execute, delete, append.",
          "Mechanisms: Access Control Lists (ACLs); UNIX model of Owner / Group / Universe.",
        ],
      },
    ],
  },
  {
    id: "unit-7",
    number: 7,
    title: "I/O Management",
    summary:
      "I/O hardware, data transfer methods, software layers, buffering/caching/spooling, and I/O scheduling.",
    sections: [
      {
        heading: "I/O Hardware",
        points: [
          "Components: device controller, port, bus, and device.",
          "Device registers: command, status, data.",
          "Addressing: port-mapped I/O (special IN/OUT instructions) vs memory-mapped I/O (normal load/store).",
        ],
      },
      {
        heading: "Data Transfer Methods",
        points: [
          "Programmed I/O (PIO): CPU polls the device; simple but wastes CPU cycles.",
          "Interrupt-driven I/O: device interrupts CPU when ready; CPU can do other work.",
          "Direct Memory Access (DMA): transfers blocks directly to/from memory without per-byte CPU involvement; one interrupt per block.",
        ],
      },
      {
        heading: "I/O Software Layers",
        points: [
          "User-level I/O software → System call interface → Device-independent OS software → Device drivers → Interrupt handlers → Hardware.",
          "Interrupt handlers: lowest level, run on hardware interrupts, must be fast.",
          "Device drivers: device-specific code translating generic requests into device commands.",
          "Device-independent layer: uniform interface, buffering, caching, error handling, naming, protection.",
        ],
      },
      {
        heading: "Buffering, Caching, Spooling",
        points: [
          "Buffering: holds data in transit to smooth speed/size mismatches (single, double, circular buffers).",
          "Caching: keeps copies of frequently accessed data for reuse (page cache, disk cache).",
          "Spooling (Simultaneous Peripheral Operations On-Line): uses disk as intermediate storage to serialize output to slow devices (e.g. printer spooling).",
        ],
      },
      {
        heading: "I/O Scheduling by Device Type",
        points: [
          "HDDs: disk scheduling matters (SCAN, C-SCAN, etc.) to minimize seek time.",
          "SSDs: no seek time; simple queues; wear-leveling considerations.",
          "Network devices: packet scheduling, QoS, flow control.",
          "Character devices (keyboard/mouse): interrupt-driven, minimal scheduling. Block devices (disks): buffering, caching, scheduling critical.",
        ],
      },
    ],
  },
]
